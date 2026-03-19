import { Link, Text, View } from '@react-pdf/renderer';
import { styles } from '../cv-document.styles';
import type { PdfHeaderProps } from './pdf-header.types';

export const PdfHeader = ({ name, titles, contact, introText }: PdfHeaderProps) => (
	<View>
		<Text style={styles.name}>{name}</Text>
		<Text style={styles.titles}>{titles.join(' | ')}</Text>

		<View style={styles.contactRow}>
			<Link src={`mailto:${contact.email}`} style={styles.contactLink}>
				{contact.email}
			</Link>
			<Text style={styles.contactSeparator}>&middot;</Text>
			<Text style={styles.contactItem}>{contact.phone}</Text>
			<Text style={styles.contactSeparator}>&middot;</Text>
			<Link src={contact.website} style={styles.contactLink}>
				{contact.website.replace('https://', '')}
			</Link>
			<Text style={styles.contactSeparator}>&middot;</Text>
			<Link src={contact.social.linkedin} style={styles.contactLink}>
				{contact.social.linkedin.replace('https://', '')}
			</Link>
			<Text style={styles.contactSeparator}>&middot;</Text>
		</View>

		<Text style={styles.introText}>{introText}</Text>
	</View>
);
