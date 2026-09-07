export const DARK_CODE_THEME = 'night-owl';

export const LIGHT_CODE_THEME = 'github-light';

/**
 * Shiki bakes token colours into inline styles, so a CSS theme switch cannot
 * reach them. Asking for both themes at once makes it emit `--shiki-light` and
 * `--shiki-dark` per token instead, which CSS *can* choose between.
 */
export const CODE_THEMES = {
	light: LIGHT_CODE_THEME,
	dark: DARK_CODE_THEME,
} satisfies Record<'light' | 'dark', string>;
