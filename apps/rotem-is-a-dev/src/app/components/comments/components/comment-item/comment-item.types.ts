import type { Comment } from '../../comments.types';

export type CommentItemProps = {
	comment: Comment;
	isOwn: boolean;
	onDelete: (id: string) => void;
};
