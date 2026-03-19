import { View, Text } from '@react-pdf/renderer';
import { SKILL_BRAND_COLORS, PDF_COLORS } from '../cv-document.constants';
import { styles } from '../cv-document.styles';
import { PdfSectionTitle } from './pdf-section-title.component';
import type { PdfSkillsProps } from './pdf-skills.types';

export const PdfSkills = ({ skills }: PdfSkillsProps) => (
	<View>
		<PdfSectionTitle title="Skills" />
		<View style={styles.skillsContainer}>
			{skills.map(skill => {
				const fillColor = SKILL_BRAND_COLORS[skill.name] ?? PDF_COLORS.accent;
				const fillWidth = (skill.level / 10) * 30;

				return (
					<View style={styles.skillTag} key={skill.name}>
						<Text style={styles.skillName}>{skill.name}</Text>
						<View style={styles.skillBar}>
							<View
								style={[
									styles.skillBarFill,
									{ width: fillWidth, backgroundColor: fillColor },
								]}
							/>
						</View>
					</View>
				);
			})}
		</View>
	</View>
);
