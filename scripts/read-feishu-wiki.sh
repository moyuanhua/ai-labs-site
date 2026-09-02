#!/usr/bin/env bash
# read-feishu-wiki.sh — Fetch a Feishu doc/wiki URL → localised Markdown + assets.
#
# Usage:  $0 <feishu_doc_or_wiki_url> [output_dir]
#
# Outputs the absolute path of the generated .md file on stdout (last line).
# All diagnostic messages go to stderr.
#
# Dependencies: lark-cli, jq, pandoc, perl
set -euo pipefail

# ── Dependency checks ────────────────────────────────────────────────
for cmd in lark-cli jq pandoc perl; do
  if ! command -v "$cmd" &>/dev/null; then
    printf 'Error: required command "%s" not found in PATH.\n' "$cmd" >&2
    exit 1
  fi
done

# ── Arguments ────────────────────────────────────────────────────────
url="${1:?Usage: $0 <feishu_doc_or_wiki_url> [output_dir]}"
output_dir="${2:-.}"
mkdir -p "$output_dir"

# ── Extract document token from URL ──────────────────────────────────
# Supports /wiki/<token>, /docx/<token>, /docs/<token> (with optional query string)
token="$(printf '%s' "$url" | perl -ne 'print $1 if m{/(?:wiki|docx|docs)/([A-Za-z0-9]+)}')"
if [[ -z "$token" ]]; then
  printf 'Error: could not extract document token from URL: %s\n' "$url" >&2
  exit 1
fi

# ── Temp directory (auto-cleaned on exit) ─────────────────────────────
tmpdir="$(mktemp -d)"
trap 'rm -rf "$tmpdir"' EXIT

# ── Step 1: Fetch document JSON via lark-cli ─────────────────────────
raw_path="$tmpdir/raw.json"
printf '[1/4] Fetching document JSON...\n' >&2
lark-cli docs +fetch --api-version v2 --doc "$url" --format json > "$raw_path"

# ── Step 2: Extract HTML body ────────────────────────────────────────
html_path="$tmpdir/content.html"
jq -r '.data.document.content' "$raw_path" > "$html_path"

if [[ ! -s "$html_path" ]]; then
  printf 'Error: extracted HTML content is empty.\n' >&2
  exit 1
fi

# ── Step 3: Download media & localise references ─────────────────────
assets_dir="$output_dir/assets"
mkdir -p "$assets_dir"

localized_html="$tmpdir/localized.html"
printf '[2/4] Localising media assets...\n' >&2

perl -e '
  use strict;
  use warnings;

  my $assets_dir  = $ARGV[0];
  my $rel_prefix  = $ARGV[1];   # relative path prefix (e.g. "assets")

  # Slurp entire HTML from stdin
  local $/;
  my $html = <STDIN>;

  my %downloaded;   # token => local relative path

  # ── Helper: download a single media token ──────────────────────────
  sub download_media {
    my ($token, $ext) = @_;
    my $filename  = "$token.$ext";
    my $out_path  = "$assets_dir/$filename";
    my $local_ref = "$rel_prefix/$filename";

    return $local_ref if exists $downloaded{$token};

    my $ret = system(
      "lark-cli", "docs", "+media-preview",
      "--token",  $token,
      "--output", $out_path,
      "--overwrite"
    );

    if ($ret == 0 && -f $out_path) {
      printf STDERR "  ✓ downloaded %s -> %s\n", $token, $out_path;
      $downloaded{$token} = $local_ref;
      return $local_ref;
    }

    printf STDERR "  ✗ warning: failed to download media %s\n", $token;
    return undef;
  }

  # ── Process <img> tags ─────────────────────────────────────────────
  while ($html =~ /(<img\s[^>]*?\/?>)/gi) {
    my $tag = $1;
    my $tok;

    # Prefer explicit token / data-token attribute; fall back to src / data-src
    if    ($tag =~ /(?:token|data-token)\s*=\s*["\x27]([^"\x27]+)["\x27]/i) { $tok = $1; }
    elsif ($tag =~ /(?:src|data-src)\s*=\s*["\x27]([^"\x27]+)["\x27]/i)     { $tok = $1; }
    next unless defined $tok;

    # Skip data-URIs, absolute URLs, already-local paths
    next if $tok =~ m{^(?:data:|https?://|\.?/)};

    # Determine extension from mime hint if present
    my $ext = "png";
    if ($tag =~ /(?:data-type|type)\s*=\s*["\x27]image\/(\w+)["\x27]/i) {
      $ext = $1;
    }

    download_media($tok, $ext);
  }

  # ── Process <source> tags (video / audio) ──────────────────────────
  while ($html =~ /(<source\s[^>]*?\/?>)/gi) {
    my $tag = $1;
    my $tok;

    if    ($tag =~ /(?:token|data-token)\s*=\s*["\x27]([^"\x27]+)["\x27]/i) { $tok = $1; }
    elsif ($tag =~ /(?:src|data-src)\s*=\s*["\x27]([^"\x27]+)["\x27]/i)     { $tok = $1; }
    next unless defined $tok;
    next if $tok =~ m{^(?:data:|https?://|\.?/)};

    my $ext = "mp4";
    if ($tag =~ /type\s*=\s*["\x27](?:video|audio)\/(\w+)["\x27]/i) {
      $ext = $1;
    }

    download_media($tok, $ext);
  }

  # ── Replace tokens with local paths (longest first → no partial matches) ─
  for my $tok (sort { length($b) <=> length($a) } keys %downloaded) {
    my $local = $downloaded{$tok};
    $html =~ s/\Q$tok\E/$local/g;
  }

  print $html;
' "$assets_dir" "assets" < "$html_path" > "$localized_html"

# ── Step 4: Convert HTML → Markdown via pandoc ───────────────────────
md_path="$output_dir/${token}.md"
printf '[3/4] Converting HTML to GFM Markdown...\n' >&2
pandoc -f html -t gfm --wrap=none "$localized_html" -o "$md_path"

if [[ ! -s "$md_path" ]]; then
  printf 'Error: generated Markdown is empty.\n' >&2
  exit 1
fi

# ── Done ─────────────────────────────────────────────────────────────
abs_md_path="$(cd "$(dirname "$md_path")" && pwd)/$(basename "$md_path")"
printf '[4/4] Done. Markdown written to: %s\n' "$abs_md_path" >&2
printf '%s\n' "$abs_md_path"
