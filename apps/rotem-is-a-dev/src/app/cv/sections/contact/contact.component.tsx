'use client';
import { FaIcon, Flex, Link } from '@/app/components';
import { useCV } from '@/app/cv/context/cv.context';
import styles from './contact.module.scss';

export const Contact = () => {
	const { contact } = useCV();

	return (
		<Flex className={styles.contactGrid}>
			<ContactItem
				name="Email"
				href={`mailto:${contact.email}`}
			/>
			<ContactItem
				name="Phone"
				href={`tel:${contact.phone}`}
			/>
			<ContactItem
				name="LinkedIn"
				href={contact.social.linkedin}
			/>
			<ContactItem
				name="GitHub"
				href={contact.social.github}
			/>
		</Flex>
	);
};

const brandIcons: string[] = ['LinkedIn', 'GitHub'] as const;

const contactIconMaps: Record<string, string> = {
  Email: 'at',
  Phone: 'phone',
  LinkedIn: 'linkedin',
  GitHub: 'github',
}

const ContactItem = ({ name, href }: { name: string; href: string }) => {
	let iconGroup: IconGroupName = 'fas';
	if (brandIcons.includes(name)) {
		iconGroup = 'fab';
	}
	return (
		<Link href={href}>
			<FaIcon
				iconGroup={iconGroup}
				iconName={contactIconMaps[name]}
			/>
			<span>{name}</span>
		</Link>
	);
};
