import { StyleSheet } from '@react-pdf/renderer';
import { PDF_COLORS, PDF_LAYOUT } from './cv-document.constants';

export const styles = StyleSheet.create({
	page: {
		backgroundColor: PDF_COLORS.background,
		padding: PDF_LAYOUT.pageMargin,
		fontFamily: 'Helvetica',
		fontSize: 9,
		color: PDF_COLORS.text,
	},
	columns: {
		flexDirection: 'row',
		gap: PDF_LAYOUT.columnGap,
	},
	leftColumn: {
		width: `${PDF_LAYOUT.leftColumnRatio * 100}%`,
		gap: PDF_LAYOUT.sectionGap,
	},
	rightColumn: {
		width: `${PDF_LAYOUT.rightColumnRatio * 100}%`,
		gap: PDF_LAYOUT.sectionGap,
	},
	card: {
		backgroundColor: PDF_COLORS.surface,
		borderRadius: PDF_LAYOUT.cardBorderRadius,
		padding: PDF_LAYOUT.cardPadding,
	},
	name: {
		fontSize: 22,
		fontFamily: 'Helvetica-Bold',
		marginBottom: 2,
	},
	titles: {
		fontSize: 10,
		color: PDF_COLORS.textMuted,
		marginBottom: 8,
	},
	contactRow: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		gap: 6,
		marginBottom: 10,
		fontSize: 8,
		color: PDF_COLORS.textMuted,
	},
	contactItem: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	contactSeparator: {
		marginHorizontal: 2,
	},
	introText: {
		fontSize: 9,
		lineHeight: 1.5,
		color: PDF_COLORS.text,
	},
	sectionTitle: {
		fontSize: 11,
		fontFamily: 'Helvetica-Bold',
		textTransform: 'uppercase',
		color: PDF_COLORS.accent,
		letterSpacing: 1,
		marginBottom: 10,
	},
	experienceItem: {
		marginBottom: 10,
	},
	experiencePosition: {
		fontSize: 10,
		fontFamily: 'Helvetica-Bold',
	},
	experienceMeta: {
		fontSize: 8,
		color: PDF_COLORS.textMuted,
		marginBottom: 4,
	},
	experienceDescription: {
		fontSize: 8.5,
		color: PDF_COLORS.text,
		marginBottom: 4,
		lineHeight: 1.4,
	},
	achievementItem: {
		flexDirection: 'row',
		marginBottom: 2,
		paddingLeft: 4,
	},
	achievementBullet: {
		width: 10,
		fontSize: 8.5,
		color: PDF_COLORS.textMuted,
	},
	achievementText: {
		flex: 1,
		fontSize: 8.5,
		lineHeight: 1.4,
	},
	separator: {
		borderBottomWidth: 1,
		borderBottomColor: PDF_COLORS.border,
		marginVertical: 8,
	},
	skillsContainer: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		gap: 6,
	},
	skillTag: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: 8,
		paddingVertical: 4,
		borderRadius: 4,
		backgroundColor: PDF_COLORS.languageBg,
	},
	skillName: {
		fontSize: 8,
		fontFamily: 'Helvetica-Bold',
		textTransform: 'uppercase',
	},
	skillBar: {
		width: 30,
		height: 3,
		backgroundColor: PDF_COLORS.skillTrack,
		borderRadius: 2,
		marginLeft: 6,
	},
	skillBarFill: {
		height: 3,
		borderRadius: 2,
	},
	languagesContainer: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		gap: 6,
	},
	languageTag: {
		paddingHorizontal: 10,
		paddingVertical: 5,
		borderRadius: 12,
		backgroundColor: PDF_COLORS.languageBg,
		fontSize: 8.5,
	},
});
