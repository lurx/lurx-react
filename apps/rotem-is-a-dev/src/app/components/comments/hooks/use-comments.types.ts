import type { Comment } from '../comments.types';

export type UseCommentsReturn = {
	comments: Comment[];
	isLoading: boolean;
	error: Nullable<string>;
	addComment: (text: string) => Promise<void>;
	deleteComment: (commentId: string) => Promise<void>;
};
