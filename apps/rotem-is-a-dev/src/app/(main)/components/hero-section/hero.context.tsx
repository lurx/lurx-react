'use client';

import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { HeroContextValue } from './hero.types';

export const heroContext = createContext<Nullable<HeroContextValue>>(null);

export const HeroProvider = ({ children }: { children: ReactNode }) => {
	const [isGameOpen, setIsGameOpen] = useState(false);
	const openGame = useCallback(() => setIsGameOpen(true), []);
	const closeGame = useCallback(() => setIsGameOpen(false), []);

	const value = useMemo(
		() => ({ isGameOpen, openGame, closeGame }),
		[isGameOpen, openGame, closeGame],
	);

	return (
		<heroContext.Provider value={value}>
			{children}
		</heroContext.Provider>
	);
};

export const useHeroContext = (): HeroContextValue => {
	const ctx = useContext(heroContext);
	if (ctx === null) {
		throw new Error('useHeroContext must be used within HeroProvider');
	}
	return ctx;
};
