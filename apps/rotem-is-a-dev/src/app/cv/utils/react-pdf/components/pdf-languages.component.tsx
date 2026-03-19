import { View, Text } from '@react-pdf/renderer';
import { styles } from '../cv-document.styles';
import { PdfSectionTitle } from './pdf-section-title.component';
import type { PdfLanguagesProps } from './pdf-languages.types';

export const PdfLanguages = ({ languages }: PdfLanguagesProps) => (
	<View>
		<PdfSectionTitle title="Languages" />
		<View style={styles.languagesContainer}>
			{languages.map(language => (
				<Text style={styles.languageTag} key={language}>
					{language}
				</Text>
			))}
		</View>
	</View>
);
