import { FaIcon } from '@/app/components';
import type { AboutFileId } from '../../data/about-files.data';
import { ABOUT_FILES } from '../../data/about-files.data';
import styles from './tab-bar.module.scss';

type TabProps = {
	tabId: AboutFileId;
	isActive: boolean;
	onSelect: (fileId: AboutFileId) => void;
	onClose: (fileId: AboutFileId) => void;
	onContextMenu: (tabId: AboutFileId, event: React.MouseEvent) => void;
}

export const Tab = ({
	tabId,
	isActive,
	onSelect,
	onClose,
	onContextMenu,
}: TabProps) => {
	const handleClick = () => onSelect(tabId);

	const handleKeyDown = (event: React.KeyboardEvent) => {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			onSelect(tabId);
		}
	};

	const handleContextMenu = (event: React.MouseEvent) => {
		onContextMenu(tabId, event);
	};

	const handleCloseClick = (event: React.MouseEvent) => {
		event.stopPropagation();
		onClose(tabId);
	};

	return (
		<div
			className={`${styles.tab} ${isActive ? styles.activeTab : ''}`}
			role="tab"
			aria-selected={isActive}
			tabIndex={isActive ? 0 : -1}
			onClick={handleClick}
			onKeyDown={handleKeyDown}
			onContextMenu={handleContextMenu}
		>
			<span>{ABOUT_FILES[tabId].title}</span>
			<button
				type="button"
				className={styles.tabClose}
				aria-label={`Close ${tabId} tab`}
				onClick={handleCloseClick}
			>
				<FaIcon
					iconName="xmark"
					iconGroup="fas"
					size="xs"
				/>
			</button>
		</div>
	);
};
