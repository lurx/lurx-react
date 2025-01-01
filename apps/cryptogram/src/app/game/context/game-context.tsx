'use client';

import { useState, useEffect, createContext, useContext, useCallback, useMemo } from 'react';
import type { LetterWithAssignedNumber, Quote } from '../../types';
import { emptyQuote } from '../game-constants';
import { useQuoteApi } from '../../hooks/use-quote-api';
import { assignNumbers } from '../../utils/assign-numbers.util';
// import { getOnlyLettersFromString } from '../../utils/get-unique-letters';

type GameContext = {
	quote: Quote;
  currentLetterIndex: number;
  setCurrentLetterIndex: (index: number) => void;
	letterMapping?: LetterWithAssignedNumber[];
};

const gameContext = createContext<GameContext>({
	quote: emptyQuote,
  currentLetterIndex: 0,
  setCurrentLetterIndex: (index: number) => void index,
});

export const useGameContext = () => useContext(gameContext);

export const GameProvider = ({ children }: { children: React.ReactNode }) => {
	const [quote, setQuote] = useState<Quote>(null);
	const [currentLetterIndex, setCurrentLetterIndex] = useState<number>(0);

  const letterMapping = useMemo(() => assignNumbers(quote?.quote), [quote]);

	const { getRandomQuote } = useQuoteApi();

	useEffect(() => {
		getRandomQuote().then(setQuote);
	}, [getRandomQuote]);

	return (
		<gameContext.Provider
			value={{
				quote,
				currentLetterIndex,
				setCurrentLetterIndex,
				letterMapping,
				// setLetterAsFound,

        // handleInputFocus
			}}
		>
			{children}
		</gameContext.Provider>
	);
};
