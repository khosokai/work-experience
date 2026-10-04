import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// YYYY-MM。YAML では引用符なしで書ける（例: start: 2011-06）
const yearMonth = z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/, 'YYYY-MM 形式で指定してください');

const experience = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/experience' }),
  schema: z.object({
    company: z.string(),
    role: z.string(),
    type: z.enum(['work', 'education']).default('work'),
    start: yearMonth,
    // 在籍中は省略する
    end: yearMonth.optional(),
    summary: z.string().optional(),
    highlights: z.array(z.string()).default([]),
    tags: z.array(z.string()).default([]),
  }),
});

const profile = defineCollection({
  loader: glob({ pattern: 'profile.md', base: './src/content' }),
  schema: z.object({
    name: z.string(),
    nameEn: z.string(),
    title: z.string(),
    location: z.string(),
    headline: z.string(),
    links: z.array(z.object({ label: z.string(), url: z.string().url() })).default([]),
    skills: z.array(z.string()).default([]),
    certifications: z.array(z.object({ name: z.string(), date: yearMonth })).default([]),
  }),
});

export const collections = { experience, profile };
