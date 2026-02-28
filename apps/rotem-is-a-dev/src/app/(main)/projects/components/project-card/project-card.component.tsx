import { FaIcon } from '@/app/components';
import styles from './project-card.module.scss';
import type { ProjectCardProps } from './project-card.types';

const TECH_ICON_MAP: Record<string, { iconName: string; iconGroup: string }> = {
	react: { iconName: 'react', iconGroup: 'fab' },
	typescript: { iconName: 'js', iconGroup: 'fab' },
	html: { iconName: 'html5', iconGroup: 'fab' },
	css: { iconName: 'css', iconGroup: 'fab' },
};

export const ProjectCard = ({ project, onViewProject }: ProjectCardProps) => {
	const primaryTech = project.technologies[0];
	const techIcon = primaryTech ? TECH_ICON_MAP[primaryTech] : undefined;
	const DemoComponent = project.demo;

	const previewContent = DemoComponent
		? <div className={styles.demoPreview} aria-hidden="true">
				<div className={styles.demoPreviewScaler}>
					<DemoComponent />
				</div>
			</div>
		: <div className={styles.imagePlaceholder} />;

	const techBadge = techIcon
		? <div className={styles.techBadge} aria-label={primaryTech}>
				<FaIcon
					iconName={techIcon.iconName}
					iconGroup={techIcon.iconGroup as 'fab' | 'fas'}
				/>
			</div>
		: null;

	return (
		<article
			className={styles.card}
			aria-label={`Project: ${project.slug}`}
		>
			<p className={styles.cardTitle}>
				<span className={styles.cardTitleNumber}>Project {project.number}</span>
				<span className={styles.cardTitleSeparator}> {'//'} </span>
				<span className={styles.cardTitleSlug}>{project.slug}</span>
			</p>

			<div className={styles.cardBody}>
				<div className={styles.imageWrapper}>
					{previewContent}
					{techBadge}
				</div>

				<div className={styles.textContent}>
					<p className={styles.description}>{project.description}</p>
					{onViewProject && (
						<button
							type="button"
							className={styles.viewButton}
							onClick={() => onViewProject(project)}
							aria-label={`View project ${project.slug}`}
						>
							view-project
						</button>
					)}
				</div>
			</div>
		</article>
	);
};
