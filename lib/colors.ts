export interface ColorDef {
  hue: number;
  sat: string;
}

export const VIBRANT_COLORS: ColorDef[] = [
  { hue: 330, sat: '72%' },
  { hue: 350, sat: '68%' },
  { hue: 15,  sat: '76%' },
  { hue: 340, sat: '74%' },
  { hue: 28,  sat: '78%' },
  { hue: 38,  sat: '82%' },
  { hue: 48,  sat: '78%' },
  { hue: 60,  sat: '70%' },
  { hue: 135, sat: '64%' },
  { hue: 120, sat: '60%' },
  { hue: 155, sat: '68%' },
  { hue: 175, sat: '66%' },
  { hue: 195, sat: '70%' },
  { hue: 205, sat: '72%' },
  { hue: 220, sat: '68%' },
  { hue: 235, sat: '68%' },
  { hue: 245, sat: '65%' },
  { hue: 260, sat: '68%' },
  { hue: 280, sat: '64%' },
  { hue: 295, sat: '62%' },
];

export function randomColor(usedHues: Set<number>): ColorDef {
  const pool = VIBRANT_COLORS.filter((c) => !usedHues.has(c.hue));
  const picked =
    pool.length > 0
      ? pool[Math.floor(Math.random() * pool.length)]
      : VIBRANT_COLORS[Math.floor(Math.random() * VIBRANT_COLORS.length)];
  usedHues.add(picked.hue);
  return picked;
}

export function deterministicColor(name: string): ColorDef {
  let hash = 0;
  for (let i = 0; i < name.length; i++)
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  const index = ((hash % VIBRANT_COLORS.length) + VIBRANT_COLORS.length) % VIBRANT_COLORS.length;
  return VIBRANT_COLORS[index];
}
