import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    cover: z.string().optional(),
  }),
});

const products = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    url: z.string().url().optional(),
    repo: z.string().url().optional(),
    cover: z.string().optional(),
    status: z.enum(['active', 'beta', 'coming-soon']).default('active'),
  }),
});

const roadmap = defineCollection({
  type: 'data',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    status: z.enum(['done', 'in-progress', 'planned']),
    quarter: z.string().optional(),
  }),
});

export const collections = { blog, products, roadmap };
