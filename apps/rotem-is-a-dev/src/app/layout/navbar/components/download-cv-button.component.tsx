import { FaIcon } from '@/app/components';
import styles from '../navbar.module.scss';
import { NavItem } from './nav-item.component';

export const DownloadCVButton = () => (
	<NavItem
		label="Download CV"
		icon={
			<FaIcon
				iconName="file-pdf"
				iconGroup="fal"
				className={styles.downloadIcon}
				data-animate-icon
			/>
		}
		href="#downloadPdf"
		active={false}
		data-animate-text="download-cv"
	/>
);
