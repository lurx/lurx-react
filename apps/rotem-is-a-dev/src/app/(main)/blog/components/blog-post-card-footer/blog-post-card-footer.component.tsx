'use client';

import { SocialActionsBar } from '@/app/components/social-actions-bar';
import { useComments, useStars } from '@/app/components/comments/hooks';
import { useAuth } from '@/app/context/auth';
import { useMemo } from 'react';
import styles from './blog-post-card-footer.module.scss';
import type { BlogPostCardFooterProps } from './blog-post-card-footer.types';

export const BlogPostCardFooter = ({
	entityType,
	entityId,
	onCommentClick,
}: BlogPostCardFooterProps) => {
	const { user } = useAuth();
	const { starCount, hasUserStarred, toggleStar } = useStars(entityType, entityId);
	const { comments } = useComments(entityType, entityId);

	const hasUserCommented = useMemo(
		() => comments.some(comment => comment.userId === user?.uid),
		[comments, user],
	);

	return (
		<div className={styles.footer} data-testid="blog-card-footer">
			<SocialActionsBar
				starCount={starCount}
				hasUserStarred={hasUserStarred}
				commentCount={comments.length}
				hasUserCommented={hasUserCommented}
				isAuthenticated={Boolean(user)}
				onStarClick={toggleStar}
				onCommentClick={onCommentClick}
			/>
		</div>
	);
};
