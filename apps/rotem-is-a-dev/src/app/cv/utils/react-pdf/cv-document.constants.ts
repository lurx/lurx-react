export const PDF_COLORS = {
	background: '#f8fafc',
	surface: '#ffffff',
	text: '#0f172a',
	textMuted: '#475569',
	accent: '#2563eb',
	border: '#e2e8f0',
	skillTrack: '#e2e8f0',
	languageBg: '#f1f5f9',
} as const;

export const SKILL_BRAND_COLORS: Record<string, string> = {
	html: '#e34f26',
	css: '#1572b6',
	javascript: '#f7df1e',
	react: '#61dafb',
	'css-in-js': '#db7093',
	scss: '#cc6699',
	git: '#f05032',
	'vue js': '#4fc08d',
} as const;

export const PDF_LAYOUT = {
	pageMargin: 24,
	cardPadding: 16,
	cardBorderRadius: 8,
	columnGap: 14,
	leftColumnRatio: 0.62,
	rightColumnRatio: 0.38,
	sectionGap: 12,
} as const;
