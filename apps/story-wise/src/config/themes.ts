/**
 * Available DaisyUI themes for Story Wise
 * Update this list to change available themes in both:
 * - Tailwind config (build-time CSS generation)
 * - Theme switcher dropdown (runtime selection)
 */
export const AVAILABLE_THEMES = ['winter', 'dim'] as const;

export type ThemeName = (typeof AVAILABLE_THEMES)[number];

export const DEFAULT_THEME: ThemeName = 'dim';
