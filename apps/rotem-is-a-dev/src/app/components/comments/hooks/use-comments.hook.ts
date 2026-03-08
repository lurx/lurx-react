'use client';

import { useAuth } from '@/app/context/auth';
import { db } from '@/lib/firebase';
import {
	addDoc,
	collection,
	deleteDoc,
	doc,
	onSnapshot,
	orderBy,
	query,
	serverTimestamp,
	where,
} from 'firebase/firestore';
import { useCallback, useEffect, useState } from 'react';
import { COMMENTS_COLLECTION } from '../comments.constants';
import type { Comment, CommentData, EntityType } from '../comments.types';
import type { UseCommentsReturn } from './use-comments.types';

export const useComments = (entityType: EntityType, entityId: string): UseCommentsReturn => {
	const [comments, setComments] = useState<Comment[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<Nullable<string>>(null);

	const { user } = useAuth();

	useEffect(() => {
		const commentsQuery = query(
			collection(db, COMMENTS_COLLECTION),
			where('entityType', '==', entityType),
			where('entityId', '==', entityId),
			orderBy('createdAt', 'desc'),
		);

		const unsubscribe = onSnapshot(
			commentsQuery,
			snapshot => {
				const loadedComments = snapshot.docs.map(commentDoc => ({
					id: commentDoc.id,
					...commentDoc.data(),
				})) as Comment[];
				setComments(loadedComments);
				setIsLoading(false);
				setError(null);
			},
			snapshotError => {
				setError(snapshotError.message);
				setIsLoading(false);
			},
		);

		return unsubscribe;
	}, [entityType, entityId]);

	const addComment = useCallback(
		async (text: string) => {
			if (!user) return;

			const commentData: Omit<CommentData, 'createdAt'> & { createdAt: ReturnType<typeof serverTimestamp> } = {
				entityType,
				entityId,
				userId: user.uid,
				displayName: user.displayName ?? '',
				photoURL: user.photoURL,
				provider: user.provider,
				text,
				createdAt: serverTimestamp(),
			};

			await addDoc(collection(db, COMMENTS_COLLECTION), commentData);
		},
		[user, entityType, entityId],
	);

	const deleteComment = useCallback(
		async (commentId: string) => {
			await deleteDoc(doc(db, COMMENTS_COLLECTION, commentId));
		},
		[],
	);

	return { comments, isLoading, error, addComment, deleteComment };
};
