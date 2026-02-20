'use client';

import { createContext, useCallback, useContext, useState } from 'react';
import type { ReactNode } from 'react';

interface HeroContextValue {
	gameCompleted: boolean;
	handleComplete: () => void;
}

export const heroContext = createContext<HeroContextValue | null>(null);

export const HeroProvider = ({ children }: { children: ReactNode }) => {
	const [gameCompleted, setGameCompleted] = useState(false);
	const handleComplete = useCallback(() => setGameCompleted(true), []);

	return (
		<heroContext.Provider value={{ gameCompleted, handleComplete }}>
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
