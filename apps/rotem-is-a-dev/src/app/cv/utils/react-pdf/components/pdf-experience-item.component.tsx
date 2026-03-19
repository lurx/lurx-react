import { Text, View } from '@react-pdf/renderer';
import { formatDuration } from '../cv-document.helpers';
import { styles } from '../cv-document.styles';
import type { PdfExperienceItemProps } from './pdf-experience-item.types';

export const PdfExperienceItem = ({ item, isLast }: PdfExperienceItemProps) => (
	<View style={styles.experienceItem}>
		<Text style={styles.experiencePosition}>{item.position}</Text>
		<Text style={styles.experienceMeta}>
			{item.company} &middot; {formatDuration(item.duration)}
		</Text>

		{item.description ? (
			<Text style={styles.experienceDescription}>{item.description}</Text>
		) : null}

		{item.achievements?.map(achievement => (
			<View style={styles.achievementItem} key={achievement}>
				<Text style={styles.achievementBullet}>&bull;</Text>
				<Text style={styles.achievementText}>{achievement}</Text>
			</View>
		))}

		{isLast ? null : <View style={styles.separator} />}
	</View>
);
