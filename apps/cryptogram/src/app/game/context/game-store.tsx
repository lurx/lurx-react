import React, {
	useReducer,
	createContext,
	ReactNode,
	useEffect,
	useRef,
  useContext,
} from 'react';
import type { LetterWithAssignedNumber, Quote } from '../../types';
import { emptyQuote } from '../game-constants';
import { useQuoteApi } from '../../hooks/use-quote-api';
import { assignNumbers } from '../../utils/assign-numbers.util';

const GameActionsTypes = {
  SetQuote: 'SET_QUOTE',
  SetCurrentLetterIndex: 'SET_CURRENT_LETTER_INDEX',
  SetUniqueLetterMap: 'SET_UNIQUE_LETTER_MAP',
  SetQuoteLetterMapping: 'SET_QUOTE_LETTER_MAPPING',
  SetLetterAsFound: 'SET_LETTER_AS_FOUND',
  SetLetterAsFoundByIndex: 'SET_LETTER_AS_FOUND_BY_INDEX',
}

// Define the shape of the state
interface GameState {
	quote: Quote;
	currentLetterIndex: number;
	uniqueLetterMap: LetterWithAssignedNumber[];
	quoteLetterMapping: LetterWithAssignedNumber[];
}

// Define the initial state
const initialState: GameState = {
	quote: emptyQuote,
	currentLetterIndex: 0,
	uniqueLetterMap: [],
	quoteLetterMapping: [],
};

// Define action types
type Action =
	| { type: 'SET_QUOTE'; payload: Quote }
	| { type: 'SET_CURRENT_LETTER_INDEX'; payload: number }
	| { type: 'SET_UNIQUE_LETTER_MAP'; payload: LetterWithAssignedNumber[] }
	| { type: 'SET_QUOTE_LETTER_MAPPING'; payload: LetterWithAssignedNumber[] }
	| { type: 'SET_LETTER_AS_FOUND'; payload: string }
	| { type: 'SET_LETTER_AS_FOUND_BY_INDEX'; payload: number };

  const GameActions = {
    [GameActionTypes.SetQuote]: (state, quote: Quote) => ({...state, ...quote})
  }
// Create the reducer function
const gameReducer = (state: GameState, action: Action): GameState => {

	switch (action.type) {
		case GameActionsTypes.SetQuote:
			return { ...state, quote: action.payload };
		case 'SET_CURRENT_LETTER_INDEX':
			return { ...state, currentLetterIndex: action.payload };
		case 'SET_UNIQUE_LETTER_MAP':
			return { ...state, uniqueLetterMap: action.payload };
		case 'SET_QUOTE_LETTER_MAPPING':
			return { ...state, quoteLetterMapping: action.payload };
		case 'SET_LETTER_AS_FOUND': {
			const updatedUniqueLetterMap = state.uniqueLetterMap.map(item =>
				item.letter === action.payload.toLowerCase()
					? { ...item, isFound: true }
					: item,
			);
			return { ...state, uniqueLetterMap: updatedUniqueLetterMap };
		}
		case 'SET_LETTER_AS_FOUND_BY_INDEX': {
			const updatedQuoteLetterMapping = [...state.quoteLetterMapping];
			updatedQuoteLetterMapping[action.payload].isFound = true;
			return { ...state, quoteLetterMapping: updatedQuoteLetterMapping };
		}
		default:
			return state;
	}
};

// Create a context
export const GameContext = createContext<{
	state: GameState;
	dispatch: React.Dispatch<Action>;
}>({ state: initialState, dispatch: () => null });

// Create a provider component
const GameProvider = ({ children }: { children: ReactNode }) => {
	const [state, dispatch] = useReducer(gameReducer, initialState);
	const { getRandomQuote } = useQuoteApi();
	const containerRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		getRandomQuote().then(quote => {
			if (!quote) return;
			dispatch({ type: 'SET_QUOTE', payload: quote });
			const uniqueLetterMap = assignNumbers(quote.quote);
			dispatch({ type: 'SET_UNIQUE_LETTER_MAP', payload: uniqueLetterMap });
			const quoteLetterMapping = getQuoteLetterMapping(
				quote.quote,
				uniqueLetterMap,
			);
			dispatch({
				type: 'SET_QUOTE_LETTER_MAPPING',
				payload: quoteLetterMapping,
			});
		});
	}, [getRandomQuote]);

	const getQuoteLetterMapping = (
		quote: string,
		uniqueLetterMap: LetterWithAssignedNumber[],
	) =>
		quote?.split('').map((letter, index) => {
			const outputLetter: LetterWithAssignedNumber = {
				letter,
				isFound: false,
				isSolved: false,
				number:
					uniqueLetterMap?.find(item => item.letter === letter.toLowerCase())
						?.number ?? 0,
			};
			return outputLetter;
		});

	const focusNextElement = () => {
		if (!containerRef.current) return;

		const focusableSelectors = `input`;
		const focusableElements: HTMLElement[] = Array.from(
			containerRef.current.querySelectorAll<HTMLElement>(focusableSelectors),
		).filter(el => !el.hasAttribute('disabled') && el.offsetParent !== null);

		if (focusableElements.length === 0) return;

		const currentIndex = focusableElements.indexOf(
			document.activeElement as HTMLElement,
		);

		const nextIndex = (currentIndex + 1) % focusableElements.length;
		const nextElement = focusableElements[nextIndex];
		nextElement?.focus();
		dispatch({ type: 'SET_CURRENT_LETTER_INDEX', payload: nextIndex });
	};

	return (
		<GameContext.Provider value={{ state, dispatch }}>
			<div ref={containerRef}>{children}</div>
		</GameContext.Provider>
	);
};

export const useGameContext = () => useContext(GameContext);


