import {
	DEFAULT_THEME,
	THEME_ATTRIBUTE,
	THEMES,
	THEME_STORAGE_KEY,
} from '../theme';

const EXPLICIT_THEMES = THEMES.filter(theme => theme !== DEFAULT_THEME);

/**
 * Runs before first paint so a stored theme is on <html> ahead of the CSS.
 * Anything other than an explicit choice leaves the attribute off, which is
 * what hands the decision to the prefers-color-scheme block in global.scss.
 */
export const THEME_INIT_SCRIPT = `try{var t=JSON.parse(localStorage.getItem(${JSON.stringify(
	THEME_STORAGE_KEY,
)}));if(${JSON.stringify(
	EXPLICIT_THEMES,
)}.indexOf(t)>-1){document.documentElement.setAttribute(${JSON.stringify(
	THEME_ATTRIBUTE,
)},t)}}catch(e){}`;
