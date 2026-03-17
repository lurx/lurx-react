import { View } from '@react-pdf/renderer';
import { sortByEndDate } from '@/app/cv/sections/experience/experience.helpers';
import { styles } from '../cv-document.styles';
import { PdfExperienceItem } from './pdf-experience-item.component';
import { PdfSectionTitle } from './pdf-section-title.component';
import type { PdfExperienceProps } from './pdf-experience.types';

export const PdfExperience = ({ workExperience }: PdfExperienceProps) => {
	const sortedJobs = sortByEndDate(workExperience);

	return (
		<View style={styles.card}>
			<PdfSectionTitle title="Experience" />
			{sortedJobs.map((job, index) => (
				<PdfExperienceItem
					key={job.company}
					item={job}
					isLast={index === sortedJobs.length - 1}
				/>
			))}
		</View>
	);
};
