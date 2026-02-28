export const INTRO_ORDER = ['greeting', 'name', 'role', 'comment', 'const'] as const;

export type IntroKey = (typeof INTRO_ORDER)[number];
