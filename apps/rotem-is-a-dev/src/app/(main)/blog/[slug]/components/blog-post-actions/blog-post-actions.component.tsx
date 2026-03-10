'use client';

import { SocialActionsBar } from '@/app/components/social-actions-bar';
import { COMMENTS_SECTION_ID } from '@/app/components/comments/comments.constants';
import { useComments, useStars } from '@/app/components/comments/hooks';
import { useAuth } from '@/app/context/auth';
import { useCallback, useMemo } from 'react';
import styles from './blog-post-actions.module.scss';
import type { BlogPostActionsProps } from './blog-post-actions.types';

export const BlogPostActions = ({ entityType, entityId }: BlogPostActionsProps) => {
	const { user } = useAuth();
	const { starCount, hasUserStarred, toggleStar } = useStars(entityType, entityId);
	const { comments } = useComments(entityType, entityId);

	const hasUserCommented = useMemo(
		() => comments.some(comment => comment.userId === user?.uid),
		[comments, user],
	);

	const handleCommentClick = useCallback(() => {
		document.getElementById(COMMENTS_SECTION_ID)?.scrollIntoView({ behavior: 'smooth' });
	}, []);

	return (
		<div className={styles.actions} data-testid="blog-post-actions">
			<SocialActionsBar
				starCount={starCount}
				hasUserStarred={hasUserStarred}
				commentCount={comments.length}
				hasUserCommented={hasUserCommented}
				isAuthenticated={Boolean(user)}
				onStarClick={toggleStar}
				onCommentClick={handleCommentClick}
			/>
		</div>
	);
};
