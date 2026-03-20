import { FaIcon } from '@/app/components/fa-icon';
import classNames from 'classnames';
import Image from 'next/image';
import { DEFAULT_AVATAR_SIZE } from './user-avatar.constants';
import styles from './user-avatar.module.scss';
import type { UserAvatarProps } from './user-avatar.types';

export const UserAvatar = ({
	photoURL,
	displayName,
	provider,
	size = DEFAULT_AVATAR_SIZE,
}: UserAvatarProps) => {
	if (!photoURL) {
		return (
			<FaIcon
				iconName="circle-user"
				iconGroup="fal"
			/>
		);
	}

	const containerStyle = size !== DEFAULT_AVATAR_SIZE
		? { '--avatar-size': `${size}px` }
		: undefined;

	return (
		<div className={classNames(styles.avatarContainer, styles[provider])} style={containerStyle}>
			<Image
				src={photoURL}
				alt={displayName ?? ''}
				width={size}
				height={size}
				className={classNames(styles.avatar, styles[provider])}
				referrerPolicy="no-referrer"
				unoptimized
			/>
			<div className={styles.avatarProvider}>
				<FaIcon iconName={provider} iconGroup="fab" size="xs" />
			</div>
		</div>
	);
};
