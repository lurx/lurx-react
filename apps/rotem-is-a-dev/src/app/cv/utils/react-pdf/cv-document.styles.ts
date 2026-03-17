import { StyleSheet } from '@react-pdf/renderer';
import { PDF_COLORS, PDF_LAYOUT } from './cv-document.constants';

export const styles = StyleSheet.create({
	page: {
		backgroundColor: PDF_COLORS.background,
		padding: PDF_LAYOUT.pageMargin,
		fontFamily: 'Helvetica',
		fontSize: 10,
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
		fontSize: 24,
		fontFamily: 'Helvetica-Bold',
		marginBottom: 2,
	},
	titles: {
		fontSize: 12,
		color: PDF_COLORS.textMuted,
		marginBottom: 8,
	},
	contactRow: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		gap: 4,
		marginBottom: 10,
		fontSize: 10,
		color: PDF_COLORS.textMuted,
	},
	contactItem: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	contactLink: {
		color: PDF_COLORS.textMuted,
		textDecoration: 'none',
	},
	contactSeparator: {
		marginHorizontal: 1,
	},
	introText: {
		fontSize: 10,
		lineHeight: 1.15,
		color: PDF_COLORS.text,
	},
	sectionTitle: {
		fontSize: 12,
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
		fontSize: 11,
		fontFamily: 'Helvetica-Bold',
	},
	experienceMeta: {
		fontSize: 9,
		color: PDF_COLORS.textMuted,
		marginVertical: 4,
	},
	experienceDescription: {
		fontSize: 10,
		color: PDF_COLORS.text,
		marginBottom: 4,
		lineHeight: 1.15,
	},
	achievementItem: {
		flexDirection: 'row',
		marginBottom: 2,
		paddingLeft: 4,
	},
	achievementBullet: {
		width: 10,
		fontSize: 10,
		color: PDF_COLORS.textMuted,
	},
	achievementText: {
		flex: 1,
		fontSize: 10,
		lineHeight: 1.15,
	},
	separator: {
		borderBottomWidth: 1,
		borderBottomColor: PDF_COLORS.border,
		marginVertical: 8,
	},
	skillsContainer: {
		gap: 4,
	},
	skillTag: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingHorizontal: 8,
		paddingVertical: 4,
		borderRadius: 4,
		backgroundColor: PDF_COLORS.languageBg,
	},
	skillName: {
		fontSize: 9,
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
		gap: 4,
	},
	languageTag: {
		paddingHorizontal: 10,
		paddingVertical: 5,
		borderRadius: 12,
		backgroundColor: PDF_COLORS.languageBg,
		fontSize: 9,
	},
});
