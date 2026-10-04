import { getCollection, getEntry, render } from 'astro:content';

const parse = (ym: string) => {
  const [y, m] = ym.split('-').map(Number);
  return { y, m };
};

export const formatYm = (ym: string) => {
  const { y, m } = parse(ym);
  return `${y}年${m}月`;
};

// 開始月・終了月を両方含めた在籍期間
const duration = (start: string, end?: string) => {
  const s = parse(start);
  const now = new Date();
  const e = end ? parse(end) : { y: now.getFullYear(), m: now.getMonth() + 1 };
  const months = (e.y - s.y) * 12 + (e.m - s.m) + 1;
  const y = Math.floor(months / 12);
  const m = months % 12;
  return `${y > 0 ? `${y}年` : ''}${m > 0 ? `${m}ヶ月` : ''}`;
};

export async function getExperiences() {
  const entries = await getCollection('experience');
  // 在籍中を先頭に、以降は開始が新しい順
  entries.sort((a, b) => {
    if (!a.data.end !== !b.data.end) return a.data.end ? 1 : -1;
    return b.data.start.localeCompare(a.data.start);
  });
  return Promise.all(
    entries.map(async (entry) => {
      const { Content } = await render(entry);
      const body = (entry.body ?? '').replace(/<!--[\s\S]*?-->/g, '').trim();
      return {
        ...entry.data,
        // 2023-09-rakko → rakko（ダイアログの URL ハッシュに使う）
        slug: entry.id.replace(/^\d{4}-\d{2}-/, ''),
        startYear: parse(entry.data.start).y,
        startLabel: formatYm(entry.data.start),
        endLabel: entry.data.end ? formatYm(entry.data.end) : '現在',
        current: !entry.data.end,
        duration: duration(entry.data.start, entry.data.end),
        hasDetail: body.length > 0,
        Content,
      };
    }),
  );
}

export type Experience = Awaited<ReturnType<typeof getExperiences>>[number];

export async function getProfile() {
  const entry = await getEntry('profile', 'profile');
  if (!entry) throw new Error('src/content/profile.md が見つかりません');
  const { Content } = await render(entry);
  return { ...entry.data, Content };
}
