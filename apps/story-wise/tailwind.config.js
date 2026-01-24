import { AVAILABLE_THEMES, DEFAULT_THEME } from './src/config/themes';

/**
 * @type {import('tailwindcss').Config}
 *
 * IMPORTANT: Keep themes in sync with src/config/themes.ts
 */
module.exports = {
	content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
	theme: {
		extend: {},
	},
	plugins: [require('daisyui')],
	daisyui: {
		themes: AVAILABLE_THEMES,
		darkTheme: DEFAULT_THEME,
	},
};
