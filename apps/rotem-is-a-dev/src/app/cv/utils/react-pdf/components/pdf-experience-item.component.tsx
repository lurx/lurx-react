import { Text, View } from '@react-pdf/renderer';
import { formatDuration } from '../cv-document.helpers';
import { styles } from '../cv-document.styles';
import type { PdfExperienceItemProps } from './pdf-experience-item.types';

export const PdfExperienceItem = ({ item, isLast }: PdfExperienceItemProps) => (
	<View style={styles.experienceItem} wrap={false}>
		<Text style={styles.experiencePosition}>{item.position}</Text>
		<Text style={styles.experienceMeta}>
			{item.company} &middot; {formatDuration(item.duration)}
		</Text>

		{item.description ? (
			<Text style={styles.experienceDescription}>{item.description}</Text>
		) : null}

		{item.achievements?.map((achievement, index) => (
			<View style={styles.achievementItem} key={index}>
				<Text style={styles.achievementBullet}>&bull;</Text>
				<Text style={styles.achievementText}>{achievement}</Text>
			</View>
		))}

		{!isLast ? <View style={styles.separator} /> : null}
	</View>
);
