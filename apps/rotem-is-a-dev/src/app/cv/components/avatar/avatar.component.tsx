import Image from 'next/image';
import { Flex } from '../flex';
import styles from './avatar.module.scss';

interface AvatarProps {
	name: string;
	image?: string; // Optional image URL for future enhancement
}

const getInitials = (name: string) => {
	const names = name.split(' ');
	const initials = names.map(part => part.charAt(0).toUpperCase()).join('');
	return initials.toUpperCase();
};

export const Avatar = ({ name, image }: AvatarProps) => {
	const initials = getInitials(name);

	const Content = () =>
		image ? (
			<Image
				src={image}
				alt={name}
				className={styles.avatar}
				width={100}
				height={100}
			/>
		) : (
			<>{initials}</>
		);

	return (
		<Flex
			justify="center"
			align="center"
			className={styles.avatar}
		>
			<Content />
		</Flex>
	);
};
