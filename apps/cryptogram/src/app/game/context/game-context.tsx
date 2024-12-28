'use client';

import { useState, useEffect, createContext, useContext } from 'react';
import type { Quote } from '../../types';
import { emptyQuote } from '../game-constants';
import { useQuoteApi } from '../../hooks/use-quote-api';

type GameContext = {
	quote: Quote;
};

const gameContext = createContext<GameContext>({
	quote: emptyQuote,
});

export const useGameContext = () => useContext(gameContext);

export const GameProvider = ({ children }: { children: React.ReactNode }) => {
	const [quote, setQuote] = useState<Quote>(null);

	const { getRandomQuote } = useQuoteApi();

	useEffect(() => {
		getRandomQuote().then(setQuote);
	}, [getRandomQuote]);

	return (
		<gameContext.Provider value={{ quote }}>{children}</gameContext.Provider>
	);
};
