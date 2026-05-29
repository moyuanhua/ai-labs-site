import { defineCollection, z } from 'astro:content';
import { glob, file } from 'astro/loaders';

const blog = defineCollection({
	loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
	schema: z.object({
		title: z.string(),
		description: z.string(),
		pubDate: z.coerce.date(),
		updatedDate: z.coerce.date().optional(),
		heroImage: z.string().optional(),
		tags: z.array(z.string()).optional(),
	}),
});

const products = defineCollection({
	loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/products' }),
	schema: z.object({
		title: z.string(),
		description: z.string(),
		pubDate: z.coerce.date(),
		heroImage: z.string().optional(),
		category: z.string().optional(),
		status: z.enum(['active', 'beta', 'deprecated']).default('active'),
	}),
});

const roadmap = defineCollection({
	loader: file('./src/content/roadmap/2024.json'),
	schema: z.object({
		title: z.string(),
		description: z.string(),
		status: z.enum(['planned', 'in-progress', 'completed']),
		quarter: z.string(),
	}),
});

export const collections = { blog, products, roadmap };
