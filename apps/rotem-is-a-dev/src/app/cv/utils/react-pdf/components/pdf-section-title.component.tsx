import { Text } from '@react-pdf/renderer';
import { styles } from '../cv-document.styles';
import type { PdfSectionTitleProps } from './pdf-section-title.types';

export const PdfSectionTitle = ({ title }: PdfSectionTitleProps) => (
	<Text style={styles.sectionTitle}>{title}</Text>
);
