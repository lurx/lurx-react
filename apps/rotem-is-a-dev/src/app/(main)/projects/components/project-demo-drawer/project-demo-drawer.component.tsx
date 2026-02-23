import { FaIcon, ResizableDrawer } from '@/app/components';
import styles from './project-demo-drawer.module.scss';
import type { ProjectDemoDrawerProps } from './project-demo-drawer.types';

export const ProjectDemoDrawer = ({
	project,
	onClose,
	children,
}: ProjectDemoDrawerProps) => {
	const isOpen = project !== null;
	const { externalUrl } = project || {};
	const hasExternalUrl = Boolean(externalUrl);

	const titleContent = project ? (
		<div className={styles.titleBar}>
			<span className={styles.slug}>{project.slug}</span>

		</div>
	) : undefined;

	return (
		<ResizableDrawer
			isOpen={isOpen}
			onClose={onClose}
			title={titleContent}
			ariaLabel={project ? `Demo: ${project.slug}` : undefined}
		>
			{project && <div className={styles.content}>{children}</div>}
			{hasExternalUrl && (
				<div className={styles.externalLink}>
					<a
						href={externalUrl?.url}
						target="_blank"
						rel="noopener noreferrer"
					>
						View on {externalUrl?.origin}
						{externalUrl?.iconName && (
							<FaIcon
								iconName={externalUrl.iconName}
								iconGroup="fab"
								size="lg"
							/>
						)}
					</a>
				</div>
			)}
		</ResizableDrawer>
	);
};
