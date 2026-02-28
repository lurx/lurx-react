import { CodeBlock, FaIcon } from '@/app/components';
import styles from '../../gist-panel.module.scss';

type GistProps = {
	title: string;
	username: string;
	createdAt: string;
	detailsCount: number;
	starsCount: number;
	code: string;
}

export const Gist = ({
	title,
	username,
	createdAt,
	detailsCount,
	starsCount,
	code,
}: GistProps) => {
	return (
		<div className={styles.snippet}>
			<div className={styles.snippetHeader}>
				<div className={styles.userInfo}>
					<div
						className={styles.avatar}
						aria-hidden="true"
					>
						{username.charAt(0).toUpperCase()}
					</div>
					<div className={styles.userDetails}>
						<span className={styles.username}>@{username}</span>
						<span className={styles.createdAt}>{createdAt}</span>
					</div>
				</div>

				<div className={styles.actions}>
					<div className={styles.action}>
						<span className={styles.actionIcon}>
							<FaIcon
								iconName="comment"
								iconGroup="fal"
							/>
						</span>
						<span>{detailsCount} details</span>
					</div>
					<div className={styles.action}>
						<span className={styles.actionIcon}>
							<FaIcon
								iconName="star"
								iconGroup="fal"
							/>
						</span>
						<span>{starsCount} stars</span>
					</div>
				</div>
			</div>

			<div className={styles.codeBlock}>
				<CodeBlock
					code={code}
					aria-label={`${title} content`}
				/>
			</div>
		</div>
	);
};
