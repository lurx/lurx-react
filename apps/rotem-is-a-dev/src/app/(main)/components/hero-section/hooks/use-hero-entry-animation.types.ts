export const INTRO_ORDER = ['greeting', 'name', 'role', 'comment', 'const', 'cta-actions'] as const;

export type IntroKey = (typeof INTRO_ORDER)[number];
