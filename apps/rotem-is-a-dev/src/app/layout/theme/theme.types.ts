export type Theme = 'system' | 'dark' | 'light';

/** What the page actually renders as, once `system` has been resolved. */
export type ResolvedTheme = Exclude<Theme, 'system'>;
