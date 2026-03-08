'use client';

import { FaIcon } from '@/app/components/fa-icon';
import { SignInDialog } from '@/app/components/sign-in-dialog';
import { useComments, useStars } from '@/app/components/comments/hooks';
import { useAuth } from '@/app/context/auth';
import { useCallback, useMemo, useState } from 'react';
import styles from './project-card-footer.module.scss';
import type { ProjectCardFooterProps } from './project-card-footer.types';

export const ProjectCardFooter = ({
	entityType,
	entityId,
	onCommentClick,
	onViewClick,
}: ProjectCardFooterProps) => {
	const { user } = useAuth();
	const { starCount, hasUserStarred, toggleStar } = useStars(entityType, entityId);
	const { comments } = useComments(entityType, entityId);

	const [isSignInOpen, setIsSignInOpen] = useState(false);

	const hasUserCommented = useMemo(
		() => comments.some(comment => comment.userId === user?.uid),
		[comments, user],
	);

	const handleStarClick = useCallback(() => {
		if (!user) {
			setIsSignInOpen(true);
			return;
		}
		toggleStar();
	}, [user, toggleStar]);

	const handleCloseSignIn = useCallback(() => {
		setIsSignInOpen(false);
	}, []);

	const starIconGroup = hasUserStarred ? 'fas' : 'fal';
	const commentIconGroup = hasUserCommented ? 'fas' : 'fal';
	const starClassName = hasUserStarred ? `${styles.action} ${styles.starActive}` : styles.action;
	const commentClassName = hasUserCommented ? `${styles.action} ${styles.commentActive}` : styles.action;

	return (
		<div className={styles.footer} data-testid="project-card-footer">
			<button
				type="button"
				className={starClassName}
				onClick={handleStarClick}
				aria-label="Star"
				data-testid="card-star-button"
			>
				<FaIcon iconName="star" iconGroup={starIconGroup} size="sm" />
				<span className={styles.count} data-testid="card-star-count">{starCount}</span>
			</button>

			<button
				type="button"
				className={commentClassName}
				onClick={onCommentClick}
				aria-label="Comments"
				data-testid="card-comment-button"
			>
				<FaIcon iconName="comment" iconGroup={commentIconGroup} size="sm" />
				<span className={styles.count} data-testid="card-comment-count">{comments.length}</span>
			</button>

			{onViewClick && (
				<button
					type="button"
					className={styles.viewButton}
					onClick={onViewClick}
					data-testid="card-view-button"
				>
					view-project
				</button>
			)}

			<SignInDialog isOpen={isSignInOpen} onClose={handleCloseSignIn} />
		</div>
	);
};
