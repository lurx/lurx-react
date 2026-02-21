'use client';

import { createContext, useCallback, useContext, useLayoutEffect, useState } from 'react';
import type { ReactNode } from 'react';

export const SESSION_KEY = 'entry-animation-played';

interface EntryAnimationContextValue {
	isShellLoaded: boolean;
	setIsShellLoaded: (value: boolean) => void;
	animationKey: number;
	triggerReplay: () => void;
}

export const EntryAnimationContext =
	createContext<EntryAnimationContextValue | null>(null);

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
			window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
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

	return (
		<EntryAnimationContext.Provider
			value={{ isShellLoaded, setIsShellLoaded, animationKey, triggerReplay }}
		>
			{children}
		</EntryAnimationContext.Provider>
	);
};

export const useEntryAnimation = (): EntryAnimationContextValue => {
	const ctx = useContext(EntryAnimationContext);
	// Safe default outside provider (e.g. in tests)
	return ctx ?? { isShellLoaded: true, setIsShellLoaded: () => {}, animationKey: 0, triggerReplay: () => {} };
};
