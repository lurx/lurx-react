import { Text, View } from '@react-pdf/renderer';
import { styles } from '../cv-document.styles';
import type { PdfHeaderProps } from './pdf-header.types';

export const PdfHeader = ({ name, titles, contact, introText }: PdfHeaderProps) => (
	<View style={styles.card}>
		<Text style={styles.name}>{name}</Text>
		<Text style={styles.titles}>{titles.join(' | ')}</Text>

		<View style={styles.contactRow}>
			<Text style={styles.contactItem}>{contact.email}</Text>
			<Text style={styles.contactSeparator}>&middot;</Text>
			<Text style={styles.contactItem}>{contact.phone}</Text>
			<Text style={styles.contactSeparator}>&middot;</Text>
			<Text style={styles.contactItem}>
				{contact.website.replace('https://', '')}
			</Text>
			<Text style={styles.contactSeparator}>&middot;</Text>
			<Text style={styles.contactItem}>
				{contact.social.linkedin.replace('https://', '')}
			</Text>
			<Text style={styles.contactSeparator}>&middot;</Text>
			<Text style={styles.contactItem}>
				{contact.social.github.replace('https://', '')}
			</Text>
		</View>

		<Text style={styles.introText}>{introText}</Text>
	</View>
);
