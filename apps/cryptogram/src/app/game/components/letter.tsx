import { ChangeEvent, useCallback, useRef, useState } from 'react';
import { useGameContext } from '../context/game-context';
import styles from './letter.module.scss';
import cn from 'classnames';
import { isLetter } from '../../utils/is-letter';
import { LetterWithAssignedNumber } from '../../types';

type LetterProps = {
	letter: string;
	index: number;
};

type InputChangeEvent = ChangeEvent<HTMLInputElement>;

const oneSec = 1000;
const startTimeout = (callback: () => void) => {
	setTimeout(() => {
		callback();
	}, oneSec);
};

export const Letter = ({ letter, index }: LetterProps) => {
	const {
		currentLetterIndex,
		setLetterAsFoundByIndex,
		uniqueLetterMap,
		setLetterAsFound,
		focusNextElement,
	} = useGameContext();

	const getLetterWithNumber = (letter: string) => {
		return uniqueLetterMap?.find(item => item.letter === letter.toLowerCase());
	};

	const letterWithNumber = getLetterWithNumber(letter);

	// const letterRef = useRef<LetterWithAssignedNumber>(getLetterWithNumber(letter));

	const [incorrect, setIncorrect] = useState(false);

	const handleIncorrect = useCallback((event: InputChangeEvent) => {
		// handle error
		console.log('incorrect!');
		setIncorrect(true);
		startTimeout(() => {
			setIncorrect(false);
			event.target.value = '';
		});
	}, []);

	const handleChange = useCallback(
		(event: InputChangeEvent) => {
			// if not a letter, preventDefault;
			const { value } = event.target;
			if (!isLetter(value)) {
				event.preventDefault();
				return;
			}
			const correct = value.toLowerCase() === letter.toLowerCase();
			if (!correct) {
				handleIncorrect(event);
				return;
			}

			console.log('correct!');
			setLetterAsFound?.(letter);
			setLetterAsFoundByIndex?.(currentLetterIndex);
			focusNextElement?.();
		},
		[
			letter,
			setLetterAsFound,
			focusNextElement,
			handleIncorrect,
			currentLetterIndex,
		],
	);

	return (
		<span
			className={cn(styles.letter, {
				[styles.found]: letterWithNumber?.isFound,
				[styles.incorrect]: incorrect,
			})}
		>
			<input
				type="text"
				className={styles.letterInput}
				onChange={handleChange}
				maxLength={1}
				placeholder="" // so placeholder-shown will have effect on empty inputs
				pattern="[a-zA-Z]"
			/>
			<span>{letter}</span>
			<span>{letterWithNumber?.number}</span>
		</span>
	);
};
