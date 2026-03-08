'use client';

import { useAuth } from '@/app/context/auth';
import { COMMENTS_STRINGS } from './comments.constants';
import styles from './comments.module.scss';
import type { CommentsProps } from './comments.types';
import { CommentForm, CommentItem, SignInPrompt } from './components';
import { useComments } from './hooks';

export const Comments = ({ entityType, entityId }: CommentsProps) => {
	const { user } = useAuth();
	const { comments, isLoading, error, addComment, deleteComment } = useComments(entityType, entityId);

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
		<section className={styles.container} data-testid="comments-section">
			<h3 className={styles.heading}>
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
