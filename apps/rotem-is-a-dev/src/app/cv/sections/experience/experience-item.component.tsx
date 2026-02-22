import styles from './experience.module.scss';

export const ExperienceItem = ({ job }: { job: ExperienceItem }) => {
	return (
		<div
			key={job.position}
			className={styles.job}
		>
			<p className={styles.jobTitle}>{job.position}</p>
			<p className={styles.jobMeta}>
				{job.company} &middot; {job.duration.start} - {job.duration.end}
			</p>
			<p className={styles.jobDescription}>{job.description}</p>
			{job.achievements && (
				<ul>
					{job.achievements.map(achievement => (
						<li key={achievement}>{achievement}</li>
					))}
				</ul>
			)}
		</div>
	);
};
