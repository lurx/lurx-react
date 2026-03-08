import { UserAvatar } from '@/app/components/user-avatar';
import { formatRelativeTime } from '../../comments.helpers';
import { COMMENT_AVATAR_SIZE, COMMENT_ITEM_STRINGS } from './comment-item.constants';
import styles from './comment-item.module.scss';
import type { CommentItemProps } from './comment-item.types';

export const CommentItem = ({ comment, isOwn, onDelete }: CommentItemProps) => {
	const relativeTime = comment.createdAt
		? formatRelativeTime(comment.createdAt)
		: '';

	return (
		<article className={styles.comment} data-testid="comment-item">
			<div className={styles.header}>
				<UserAvatar
					photoURL={comment.photoURL}
					displayName={comment.displayName}
					provider={comment.provider}
					size={COMMENT_AVATAR_SIZE}
				/>
				<span className={styles.author}>{comment.displayName}</span>
				<time className={styles.time} data-testid="comment-time">
					{relativeTime}
				</time>
				{isOwn && (
					<button
						type="button"
						className={styles.deleteButton}
						onClick={() => onDelete(comment.id)}
						aria-label={COMMENT_ITEM_STRINGS.DELETE_LABEL}
						data-testid="comment-delete"
					>
						{COMMENT_ITEM_STRINGS.DELETE}
					</button>
				)}
			</div>
			<p className={styles.text}>{comment.text}</p>
		</article>
	);
};
