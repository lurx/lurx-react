'use client';

import { useAuth } from '@/app/context/auth';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { COMMENTS_SECTION_ID, COMMENTS_STRINGS } from './comments.constants';
import styles from './comments.module.scss';
import type { CommentsProps } from './comments.types';
import { CommentForm, CommentItem, SignInPrompt, SocialActionsBar } from './components';
import { useComments, useStars } from './hooks';

export const Comments = ({ entityType, entityId, autoScrollToComments }: CommentsProps) => {
	const { user } = useAuth();
	const { comments, isLoading, error, addComment, deleteComment } = useComments(entityType, entityId);
	const { starCount, hasUserStarred, toggleStar } = useStars(entityType, entityId);

	const headingRef = useRef<HTMLHeadingElement>(null);

	const hasUserCommented = useMemo(
		() => comments.some(comment => comment.userId === user?.uid),
		[comments, user],
	);

	const handleCommentClick = useCallback(() => {
		headingRef.current?.scrollIntoView({ behavior: 'smooth' });
	}, []);

	useEffect(() => {
		if (autoScrollToComments) {
			headingRef.current?.scrollIntoView({ behavior: 'smooth' });
		}
	}, [autoScrollToComments]);

	const renderContent = () => {
		if (isLoading) {
			return <p className={styles.status} data-testid="comments-loading">{COMMENTS_STRINGS.LOADING}</p>;
		}

		if (error) {
			return <p className={styles.status} data-testid="comments-error">{COMMENTS_STRINGS.ERROR}</p>;
		}

		if (comments.length === 0) {
			return <p className={styles.status} data-testid="comments-empty">{COMMENTS_STRINGS.EMPTY}</p>;
		}

		return (
			<div className={styles.list} data-testid="comments-list">
				{comments.map(comment => (
					<CommentItem
						key={comment.id}
						comment={comment}
						isOwn={comment.userId === user?.uid}
						onDelete={deleteComment}
					/>
				))}
			</div>
		);
	};

	return (
		<section id={COMMENTS_SECTION_ID} className={styles.container} data-testid="comments-section">
			<SocialActionsBar
				starCount={starCount}
				hasUserStarred={hasUserStarred}
				commentCount={comments.length}
				hasUserCommented={hasUserCommented}
				isAuthenticated={Boolean(user)}
				onStarClick={toggleStar}
				onCommentClick={handleCommentClick}
			/>
			<h3 className={styles.heading} ref={headingRef}>
				{COMMENTS_STRINGS.HEADING}
				{!isLoading && !error && comments.length > 0 && (
					<span className={styles.count} data-testid="comments-count">
						({comments.length})
					</span>
				)}
			</h3>
			{user ? <CommentForm onSubmit={addComment} /> : <SignInPrompt />}
			{renderContent()}
		</section>
	);
};
