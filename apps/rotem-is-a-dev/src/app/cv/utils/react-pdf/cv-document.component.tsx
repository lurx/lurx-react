import { Document, Page, View } from '@react-pdf/renderer';
import cv from '@/data/cv.data';
import { resolveIntroText } from './cv-document.helpers';
import { styles } from './cv-document.styles';
import { PdfHeader, PdfExperience, PdfSkills, PdfLanguages } from './components';
import type { CvDocumentProps } from './cv-document.types';

export const CvDocument = ({ data = cv }: CvDocumentProps) => {
	const introText = resolveIntroText(data.intro, data.work_experience);

	return (
		<Document>
			<Page size="A4" style={styles.page}>
				<View style={styles.columns}>
					<View style={styles.leftColumn}>
						<PdfHeader
							name={data.name}
							titles={data.titles}
							contact={data.contact}
							introText={introText}
						/>
						<PdfExperience workExperience={data.work_experience} />
					</View>

					<View style={styles.rightColumn}>
						<View style={styles.card}>
							<PdfSkills skills={data.skills} />
							<View style={{ marginTop: 16 }}>
								<PdfLanguages languages={data.languages} />
							</View>
						</View>
					</View>
				</View>
			</Page>
		</Document>
	);
};
