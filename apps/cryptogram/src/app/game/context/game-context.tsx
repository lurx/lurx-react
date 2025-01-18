'use client';

import {
	useState,
	useEffect,
	createContext,
	useContext,
	useCallback,
	useRef,
} from 'react';
import type { LetterWithAssignedNumber, Quote, RequireAll } from '../../types';
import { emptyQuote } from '../game-constants';
import { useQuoteApi } from '../../hooks/use-quote-api';
import { assignNumbers } from '../../utils/assign-numbers.util';
// import { getOnlyLettersFromString } from '../../utils/get-unique-letters';
// import { useFocusManager } from './use-focus-manager';
// type GameContext = {
// 	quote: Quote;
// 	currentLetterIndex: number;
// 	setCurrentLetterIndex: (index: number) => void;
// 	uniqueLetterMap?: LetterWithAssignedNumber[];
// 	setLetterAsFound?: (letter: string) => void;
// 	setLetterAsFoundByIndex?: (index: number) => void;
// 	focusNextElement?: () => void;
// 	quoteLetterMapping?: LetterWithAssignedNumber[];
// };

// const gameContext = createContext<GameContext>({
// 	quote: emptyQuote,
// 	currentLetterIndex: 0,
// 	setCurrentLetterIndex: (index: number) => void index,
// });
import { useGameContext } from './game-store';

export const GameProvider = ({ children }: { children: React.ReactNode }) => {
  const {state, dispatch} = useGameContext();
	// const [quote, setQuote] = useState<Quote>(null);
	// const [currentLetterIndex, setCurrentLetterIndex] = useState<number>(0);
	// const [quoteLetterMapping, setQuoteLetterMapping] = useState<
	// 	LetterWithAssignedNumber[] | []
	// >([]);
	// const [uniqueLetterMap, setUniqueLetterMap] = useState<
	// 	LetterWithAssignedNumber[]
	// >([]);

	// const getQuoteLetterMapping = (quote: string) =>
	// 	quote?.split('').map((letter, index) => {
	// 		const outputLetter: LetterWithAssignedNumber = {
	// 			letter,
	// 			isFound: false,
	// 			isSolved: false,
	// 			number:
	// 				uniqueLetterMap?.find(item => item.letter === letter.toLowerCase())
	// 					?.number ?? 0,
	// 		};
	// 		return outputLetter;
	// 	});

	// const updateQuoteLetterMapping = (newArray: LetterWithAssignedNumber[]) => {
	// 	setQuoteLetterMapping(prev => [...prev, ...newArray]);
	// };

	// const setLetterAsFoundByIndex = (index: number) => {
	// 	const updatedLetterMapping = [...quoteLetterMapping];
	// 	updatedLetterMapping[index].isFound = true;
	// 	updateQuoteLetterMapping(updatedLetterMapping);
	// };

	// const setLetterAsFound = (letter: string) => {
	// 	const isLetterAlreadyFound = uniqueLetterMap.some(
	// 		item => item.letter === letter.toLowerCase() && item.isFound,
	// 	);
	// 	if (isLetterAlreadyFound) return;
	// 	const updatedLetterMapping = uniqueLetterMap.map(item => {
	// 		if (item.letter === letter.toLowerCase()) {
	// 			return {
	// 				...item,
	// 				isFound: true,
	// 			};
	// 		}
	// 		return item;
	// 	});
	// 	setUniqueLetterMap(updatedLetterMapping);
	// 	// setLetterAsFoundByIndex(currentLetterIndex)
	// };



	const { getRandomQuote } = useQuoteApi();

  const setQuote = (newQuote: Quote) => {
    dispatch({type: 'SET_QUOTE', payload: newQuote})
  }

  const setCurrentLetterIndex = (index: number) => {
    dispatch({ type: 'SET_CURRENT_LETTER_INDEX', payload: index });
  };

  const setLetterAsFoundByIndex = (index: number) => {
    dispatch({ type: 'SET_LETTER_AS_FOUND_BY_INDEX', payload: index });
  };

  const setLetterAsFound = (letter: string) => {
    dispatch({ type: 'SET_LETTER_AS_FOUND', payload: letter });
  };
	// focus manager logic
	const containerRef = useRef<HTMLDivElement | null>(null);

	const focusNextElement = () => {
		if (!containerRef.current) return;

		// Define focusable selectors
		const focusableSelectors = `input`;

		// Get all focusable elements within the container
		const focusableElements: HTMLElement[] = Array.from(
			containerRef.current.querySelectorAll<HTMLElement>(focusableSelectors),
		).filter(el => !el.hasAttribute('disabled') && el.offsetParent !== null);

		if (focusableElements.length === 0) return;

		// Get the currently focused element
		const currentIndex = focusableElements.indexOf(
			document.activeElement as HTMLElement,
		);

		// Determine the next index (loop back to the start if at the end)
		const nextIndex = (currentIndex + 1) % focusableElements.length;

		const nextElement = focusableElements[nextIndex];

		// Focus the next element
		nextElement?.focus();
		setCurrentLetterIndex(nextIndex);
	};

	useEffect(() => {
		getRandomQuote().then(quote => {
			if (!quote) return;
			setQuote(quote);
			setUniqueLetterMap(assignNumbers(quote.quote));
			updateQuoteLetterMapping(getQuoteLetterMapping(quote.quote));
		});
	}, [getRandomQuote]);

	return (
		<gameContext.Provider
			value={{
				// quote,
				// quoteLetterMapping,
				// currentLetterIndex,
				// setCurrentLetterIndex,
				// uniqueLetterMap,
        ...state,
				setLetterAsFound,
				setLetterAsFoundByIndex,

				// handleInputFocus
				focusNextElement,
			}}
		>
			<div ref={containerRef}>{children}</div>
		</gameContext.Provider>
	);
};
