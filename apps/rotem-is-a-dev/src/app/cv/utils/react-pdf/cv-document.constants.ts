export const PDF_TITLE = 'rotem-horovitz-cv';
export const PDF_FILE_NAME = `${PDF_TITLE}.pdf`;
export const PDF_COLORS = {
	background: '#f8fafc',
	surface: '#ffffff',
	text: '#0f172a',
	textMuted: '#475569',
	accent: '#2563eb',
	border: '#e2e8f0',
	skillTrack: '#c7c7c7',
	languageBg: '#f1f5f9',
} as const;

export const SKILL_BRAND_COLORS: Record<string, string> = {
	html: '#e34f26',
	css: '#1572b6',
	javascript: '#f7df1e',
  typescript: '#3178C6',
	react: '#61dafb',
	'css-in-js': '#db7093',
	scss: '#cc6699',
	git: '#f05032',
	'vue js': '#4fc08d',
};

export const PDF_LAYOUT = {
	pageMargin: 20,
	cardPadding: 12,
	cardBorderRadius: 8,
	columnGap: 12,
	leftColumnRatio: 0.74,
	rightColumnRatio: 0.26,
	sectionGap: 12,
} as const;
