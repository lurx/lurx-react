import { THEME_INIT_SCRIPT } from './theme-init-script.constants';

export const ThemeInitScript = () => (
	<script
		// Inline and synchronous on purpose: a deferred script would let the
		// default theme paint first and flash on every navigation-free load.
		dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }}
	/>
);
