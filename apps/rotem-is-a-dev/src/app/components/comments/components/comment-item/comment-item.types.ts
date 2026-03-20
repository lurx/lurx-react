import type { Comment } from '../../comments.types';

export type CommentItemProps = {
	comment: Comment;
	isOwn: boolean;
	onDeleteAction: (id: string) => void;
};
