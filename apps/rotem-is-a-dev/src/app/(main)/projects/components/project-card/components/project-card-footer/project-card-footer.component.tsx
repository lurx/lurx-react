'use client';

import styles from './project-card-footer.module.scss';
import type { ProjectCardFooterProps } from './project-card-footer.types';

export const ProjectCardFooter = ({
	onViewClickAction,
}: ProjectCardFooterProps) => {
	return (
		<div className={styles.footer} data-testid="project-card-footer">
			<button
				type="button"
				className={styles.viewButton}
				onClick={onViewClickAction}
				data-testid="card-view-button"
			>
				view-project
			</button>
		</div>
	);
};
