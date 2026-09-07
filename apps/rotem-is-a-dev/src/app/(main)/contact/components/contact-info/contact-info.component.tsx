import { FaIcon } from '@/app/components';
import { contactPageStrings } from '../../contact-page.strings';
import { CONTACT_CHANNELS } from './contact-info.constants';
import styles from './contact-info.module.scss';
import type { ContactChannel } from './contact-info.types';

const renderChannel = (channel: ContactChannel) => {
	const iconGroup = channel.external ? 'fab' : 'fal';
	const externalProps = channel.external
		? { target: '_blank', rel: 'noopener noreferrer' }
		: {};

	return (
		<li key={channel.id}>
			<a
				href={channel.href}
				className={styles.channel}
				aria-label={`${channel.label}: ${channel.value}`}
				{...externalProps}
			>
				<FaIcon
					iconName={channel.iconName}
					iconGroup={iconGroup}
					className={styles.channelIcon}
				/>
				<span className={styles.channelText}>
					<span className={styles.channelLabel}>_{channel.label}</span>
					<span className={styles.channelValue}>{channel.value}</span>
				</span>
			</a>
		</li>
	);
};

export const ContactInfo = () => (
	<aside className={styles.info}>
		<p className={styles.heading}>{contactPageStrings.infoHeading}</p>
		<ul className={styles.channelList}>
			{CONTACT_CHANNELS.map(renderChannel)}
		</ul>
	</aside>
);
