import { FaIcon } from '@/app/components';
import type { AboutFileId } from '../../data/about-files.data';
import { ABOUT_FILES } from '../../data/about-files.data';
import styles from './tab-bar.module.scss';

interface TabBarProps {
	openTabs: AboutFileId[];
	activeFileId: Nullable<AboutFileId>;
	onTabSelect: (fileId: AboutFileId) => void;
	onTabClose: (fileId: AboutFileId, event: React.MouseEvent) => void;
}

export const TabBar = ({
	openTabs,
	activeFileId,
	onTabSelect,
	onTabClose,
}: TabBarProps) => (
	<div
		className={styles.tabBar}
		role="tablist"
	>
		{openTabs.map(tabId => (
			<div
				key={tabId}
				className={`${styles.tab} ${tabId === activeFileId ? styles.activeTab : ''}`}
				role="tab"
				aria-selected={tabId === activeFileId}
				onClick={() => onTabSelect(tabId)}
			>
				<span>{ABOUT_FILES[tabId].title}</span>
				<button
					type="button"
					className={styles.tabClose}
					aria-label={`Close ${tabId} tab`}
					onClick={event => onTabClose(tabId, event)}
				>
					<FaIcon
						iconName="xmark"
						iconGroup="fas"
						size="xs"
					/>
				</button>
			</div>
		))}
	</div>
);
