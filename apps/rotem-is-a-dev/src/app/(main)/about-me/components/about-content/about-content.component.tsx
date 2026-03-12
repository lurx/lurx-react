import styles from '../../about-page.module.scss';
import { GistPanel } from '../gist-panel';
import { TabBar } from '../tab-bar';
import type { AboutContentProps } from './about-content.types';

export const AboutContent = ({
	openTabs,
	activeFileId,
	onTabSelect,
	onTabClose,
	onCloseOthers,
	onCloseAll,
	children,
}: AboutContentProps) => {
	const sidePanel = activeFileId ? <GistPanel /> : null;

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
				{sidePanel}
			</div>
		</div>
	);
};
