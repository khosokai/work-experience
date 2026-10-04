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
    // 別の経歴から分岐するブランチとして表示する場合に、分岐元のファイル名（日付を除いた部分）を指定する
    parent: z.string().optional(),
    // ブランチに付けるラベル（例: 業務委託）
    contract: z.string().optional(),
    // 同じ所属の中での役割の変遷。指定するとそれぞれが1コミットとして表示される
    roles: z
      .array(
        z.object({
          role: z.string(),
          start: yearMonth,
          end: yearMonth.optional(),
          summary: z.string().optional(),
          highlights: z.array(z.string()).default([]),
          // 省略すると、先頭の役割に経歴全体の tags を表示する
          tags: z.array(z.string()).default([]),
        }),
      )
      .default([]),
  }),
});

const profile = defineCollection({
  loader: glob({ pattern: 'profile.md', base: './src/content' }),
  schema: z.object({
    name: z.string(),
    title: z.string(),
    location: z.string(),
    headline: z.string(),
    // label が X / Wantedly のものはアイコンで表示する
    links: z.array(z.object({ label: z.string(), url: z.string().url() })).default([]),
    skills: z.array(z.string()).default([]),
    certifications: z.array(z.object({ name: z.string(), date: yearMonth })).default([]),
  }),
});

export const collections = { experience, profile };
