/**
 * Mermaid chart theme configuration.
 *
 * Edit the values below to change how mermaid diagrams render
 * across all blog posts. Changes require a rebuild to take effect.
 *
 * Color reference (from global.scss design tokens):
 *   --bg:          #0f172b
 *   --surface:     #1d293d
 *   --surface-alt: #1d293d
 *   --border:      #314158
 *   --text:        #f8fafc
 *   --muted:       #90a1b9
 *   --teal:        #43d9ad
 *   --orange:      #ffb86a
 *   --purple:      #c792ea
 *   --cyan:        #89ddff
 */

export const mermaidConfig = {
	strategy: 'inline-svg' as const,
	colorScheme: 'dark' as const,
	mermaidConfig: {
		theme: 'base' as const,
		themeVariables: {
			// ─── Backgrounds ──────────────────────────────────────────────
			background: '#1d293d',
			mainBkg: '#1d293d',
			clusterBkg: '#0f172b',
			edgeLabelBackground: '#0f172b',

			// ─── Borders ──────────────────────────────────────────────────
			primaryBorderColor: '#314158',
			secondaryBorderColor: '#314158',
			tertiaryBorderColor: '#314158',
			nodeBorder: '#314158',
			clusterBorder: '#314158',

			// ─── Primary (default nodes) ──────────────────────────────────
			primaryColor: '#1d293d',
			primaryTextColor: '#f8fafc',

			// ─── Secondary ────────────────────────────────────────────────
			secondaryColor: '#0f172b',
			secondaryTextColor: '#f8fafc',

			// ─── Tertiary ─────────────────────────────────────────────────
			tertiaryColor: '#0f172b',
			tertiaryTextColor: '#f8fafc',

			// ─── Lines & text ─────────────────────────────────────────────
			lineColor: '#43d9ad',
			textColor: '#f8fafc',
			titleColor: '#f8fafc',
			nodeTextColor: '#f8fafc',

			// ─── Pie chart slices ─────────────────────────────────────────
			pie1: '#43d9ad',
			pie2: '#ffb86a',
			pie3: '#c792ea',
			pie4: '#89ddff',
			pieTitleTextColor: '#f8fafc',
			pieSectionTextColor: '#0f172b',
			pieLegendTextColor: '#f8fafc',
			pieStrokeColor: '#314158',
			pieOuterStrokeColor: '#314158',
		},
	},
};
