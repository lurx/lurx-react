import type { DemoCreditsData } from "../demo-credits";

export const leftRight = ['left', 'right'] as const;

export const inspiredBy = {
  name: 'Wolverine',
  url: 'https://dribbble.com/shots/2047572-Wolverine',
  author: 'Gregory Hartman',
  authorUrl: 'https://dribbble.com/gregoryhartman',
} satisfies DemoCreditsData;
