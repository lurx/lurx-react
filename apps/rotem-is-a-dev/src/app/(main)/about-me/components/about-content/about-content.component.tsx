import styles from '../../about-page.module.scss';
import { GamingPanel } from '../gaming-panel';
import { GistPanel } from '../gist-panel';
import { TabBar } from '../tab-bar';
import type { AboutContentProps } from './about-content.types';

export const AboutContent = ({
	openTabs,
	activeFileId,
	activeSection,
	onTabSelect,
	onTabClose,
	onCloseOthers,
	onCloseAll,
	children,
}: AboutContentProps) => {
	function renderSidePanel() {
		if (activeSection === 'gaming') return <GamingPanel activeFileId={activeFileId} />;
		if (activeFileId) return <GistPanel />;
		return null;
	}

	return (
		<div className={styles.content}>
			<TabBar
				openTabs={openTabs}
				activeFileId={activeFileId}
				onTabSelect={onTabSelect}
				onTabClose={onTabClose}
				onCloseOthers={onCloseOthers}
				onCloseAll={onCloseAll}
			/>

			<div className={styles.panels}>
				{children}
				{renderSidePanel()}
			</div>
		</div>
	);
};
