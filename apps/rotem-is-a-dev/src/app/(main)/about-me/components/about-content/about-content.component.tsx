import styles from '../../about-page.module.scss';
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

			<div className={styles.panels}>{children}</div>
		</div>
	);
};
