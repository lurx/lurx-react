'use client';

import { useAuth } from '@/app/context/auth';
import { db } from '@/lib/firebase';
import {
	addDoc,
	collection,
	deleteDoc,
	doc,
	onSnapshot,
	query,
	where,
} from 'firebase/firestore';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { STARS_COLLECTION } from '../comments.constants';
import type { EntityType } from '../comments.types';
import type { Star, UseStarsReturn } from './use-stars.types';

export const useStars = (entityType: EntityType, entityId: string): UseStarsReturn => {
	const [stars, setStars] = useState<Star[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<Nullable<string>>(null);

	const { user } = useAuth();

	useEffect(() => {
		const starsQuery = query(
			collection(db, STARS_COLLECTION),
			where('entityType', '==', entityType),
			where('entityId', '==', entityId),
		);

		const unsubscribe = onSnapshot(
			starsQuery,
			snapshot => {
				const loadedStars = snapshot.docs.map(starDoc => ({
					id: starDoc.id,
					...starDoc.data(),
				})) as Star[];
				setStars(loadedStars);
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

	const hasUserStarred = useMemo(
		() => stars.some(star => star.userId === user?.uid),
		[stars, user],
	);

	const toggleStar = useCallback(async () => {
		if (!user) return;

		const existingStar = stars.find(star => star.userId === user.uid);

		if (existingStar) {
			await deleteDoc(doc(db, STARS_COLLECTION, existingStar.id));
		} else {
			await addDoc(collection(db, STARS_COLLECTION), {
				entityType,
				entityId,
				userId: user.uid,
			});
		}
	}, [user, stars, entityType, entityId]);

	return { starCount: stars.length, hasUserStarred, isLoading, error, toggleStar };
};
