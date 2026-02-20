import { FaIcon } from '@/app/components';
import { AboutEditor } from '../about-editor/about-editor.component';
import { FileTree } from '../file-tree/file-tree.component';
import { GistPanel } from '../gist-panel/gist-panel.component';
import styles from './about-page.module.scss';

export const AboutPage = () => {
	return (
		<div className={styles.page}>
			<aside
				className={styles.sidebar}
				aria-label="About sections"
			>
				<button
					className={styles.sidebarIcon}
					aria-label="Professional info"
					type="button"
				>
					<FaIcon
						iconName="briefcase"
						iconGroup="fal"
					/>
				</button>
				<button
					className={`${styles.sidebarIcon} ${styles.activeIcon}`}
					aria-label="Personal info"
					type="button"
				>
					<FaIcon
						iconName="user"
						iconGroup="fal"
					/>
				</button>
				<button
					className={styles.sidebarIcon}
					aria-label="Hobbies"
					type="button"
				>
					<FaIcon
						iconName="gamepad"
						iconGroup="fal"
					/>
				</button>
			</aside>

			<div
				className={styles.fileTree}
				role="navigation"
				aria-label="File tree"
			>
				<FileTree />
			</div>

			<div className={styles.content}>
				<div
					className={styles.tabBar}
					role="tablist"
				>
					<div
						className={`${styles.tab} ${styles.activeTab}`}
						role="tab"
						aria-selected={true}
					>
						<span>education</span>
						<span
							className={styles.tabClose}
							aria-label="Close tab"
						>
							×
						</span>
					</div>
				</div>

				<div className={styles.panels}>
					<AboutEditor />
					<GistPanel />
				</div>
			</div>
		</div>
	);
};
