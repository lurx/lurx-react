/**
 * Inline script that runs before first paint to restore accessibility
 * preferences (text scale, line height, letter spacing) from localStorage.
 * Injected via dangerouslySetInnerHTML in the root layout.
 * Imported with ?raw so it stays as a plain string — not bundled as a module.
 */
(function () {
	try {
		const scale = localStorage.getItem('accessibility-text-scale');
		if (scale) {
			const scaleValue = JSON.parse(scale);
			if ([100, 125, 150, 175, 200].indexOf(scaleValue) !== -1 && scaleValue !== 100) {
				document.documentElement.style.setProperty('--root-font-size', 14 * scaleValue / 100 + 'px');
			}
		}

		const lineHeight = localStorage.getItem('accessibility-line-height');
		if (lineHeight) {
			const lineHeightLevel = JSON.parse(lineHeight);
			if ([1, 2, 3].indexOf(lineHeightLevel) !== -1) {
				const lineHeightValue = ['Normal', 1.5, 1.75, 2.0][lineHeightLevel];
				document.documentElement.style.setProperty('--a11y-line-height', String(lineHeightValue));
			}
		}

		const letterSpacing = localStorage.getItem('accessibility-letter-spacing');
		if (letterSpacing) {
			const letterSpacingLevel = JSON.parse(letterSpacing);
			if ([1, 2, 3].indexOf(letterSpacingLevel) !== -1) {
				const letterSpacingValue = ['Normal', 0.05, 0.1, 0.15][letterSpacingLevel];
				document.documentElement.style.setProperty('--a11y-letter-spacing', letterSpacingValue + 'em');
			}
		}
	} catch (_error) { /* accessibility preferences unavailable */ }
})();
