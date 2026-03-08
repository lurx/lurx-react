'use client';

import { FaIcon } from '@/app/components/fa-icon';
import { SignInDialog } from '@/app/components/sign-in-dialog';
import { useCallback, useState } from 'react';
import {
	SOCIAL_ACTIONS_BAR_ICONS,
	SOCIAL_ACTIONS_BAR_LABELS,
} from './social-actions-bar.constants';
import styles from './social-actions-bar.module.scss';
import type { SocialActionsBarProps } from './social-actions-bar.types';
import classNames from 'classnames';
import { getSocialButtonIconGroup } from './social-actions-bar.helpers';

export const SocialActionsBar = ({
	starCount,
	hasUserStarred,
	commentCount,
	hasUserCommented,
	isAuthenticated,
	onStarClick,
	onCommentClick,
	className,
}: SocialActionsBarProps) => {
	const [isSignInOpen, setIsSignInOpen] = useState(false);

	const handleStarClick = useCallback(() => {
		if (!isAuthenticated) {
			setIsSignInOpen(true);
			return;
		}
		onStarClick();
	}, [isAuthenticated, onStarClick]);

	const handleCloseSignIn = useCallback(() => {
		setIsSignInOpen(false);
	}, []);

  const starIconGroup = getSocialButtonIconGroup(hasUserStarred);
	const commentIconGroup = getSocialButtonIconGroup(hasUserCommented);
	const starClassName = classNames(styles.action, {
		[styles.starActive]: hasUserStarred,
	});

	const commentClassName = classNames(styles.action, {
		[styles.commentActive]: hasUserCommented,
	});

	const starLabel = hasUserStarred
		? SOCIAL_ACTIONS_BAR_LABELS.UNSTAR
		: SOCIAL_ACTIONS_BAR_LABELS.STAR;
	const barClassName = className ? `${styles.bar} ${className}` : styles.bar;

	return (
		<div
			className={barClassName}
			data-testid="social-actions-bar"
		>
			<button
				type="button"
				className={starClassName}
				onClick={handleStarClick}
				aria-label={starLabel}
				data-testid="star-button"
			>
				<FaIcon
					iconName={SOCIAL_ACTIONS_BAR_ICONS.STAR}
					iconGroup={starIconGroup}
					size="sm"
				/>
				<span
					className={styles.count}
					data-testid="star-count"
				>
					{starCount}
				</span>
			</button>

			<button
				type="button"
				className={commentClassName}
				onClick={onCommentClick}
				aria-label={SOCIAL_ACTIONS_BAR_LABELS.COMMENTS}
				data-testid="comment-button"
			>
				<FaIcon
					iconName={SOCIAL_ACTIONS_BAR_ICONS.COMMENT}
					iconGroup={commentIconGroup}
					size="sm"
				/>
				<span
					className={styles.count}
					data-testid="comment-count"
				>
					{commentCount}
				</span>
			</button>

			<SignInDialog
				isOpen={isSignInOpen}
				onClose={handleCloseSignIn}
			/>
		</div>
	);
};
