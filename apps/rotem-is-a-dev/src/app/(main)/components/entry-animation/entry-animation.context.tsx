'use client';

import { createContext, useCallback, useContext, useLayoutEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { EntryAnimationContextValue } from './entry-animation.types';

export const SESSION_KEY = 'entry-animation-played';

export const entryAnimationContext =
	createContext<Nullable<EntryAnimationContextValue>>(null);

export const EntryAnimationProvider = ({
	children,
}: {
	children: ReactNode;
}) => {
	const [isShellLoaded, setIsShellLoaded] = useState(false);
	const [animationKey, setAnimationKey] = useState(0);

	// Runs synchronously before the browser paints.
	// On repeat visits (or reduced-motion), set isShellLoaded = true before
	// the first paint so the hero is never hidden even for one frame.
	useLayoutEffect(() => {
		const shouldSkip =
			globalThis.matchMedia('(prefers-reduced-motion: reduce)').matches ||
			Boolean(sessionStorage.getItem(SESSION_KEY));

		if (shouldSkip) {
			setIsShellLoaded(true);
		}
	}, []);

	const triggerReplay = useCallback(() => {
		sessionStorage.removeItem(SESSION_KEY);
		setIsShellLoaded(false);
		setAnimationKey(prev => prev + 1);
	}, []);

	const value = useMemo(
		() => ({ isShellLoaded, setIsShellLoaded, animationKey, triggerReplay }),
		[isShellLoaded, setIsShellLoaded, animationKey, triggerReplay],
	);

	return (
		<entryAnimationContext.Provider value={value}>
			{children}
		</entryAnimationContext.Provider>
	);
};

export const useEntryAnimation = (): EntryAnimationContextValue => {
	const ctx = useContext(entryAnimationContext);
	if (!ctx) {
		throw new Error('useEntryAnimation must be used within EntryAnimationProvider');
	}
	return ctx;
};
