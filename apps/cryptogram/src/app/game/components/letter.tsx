import { useGameContext } from '../context/game-context';
import styles from './letter.module.scss';
import cn from 'classnames';

type LetterProps = {
	letter: string;
	index: number;
};

export const Letter = ({ letter, index }: LetterProps) => {
	const {
		letterMapping,
	} = useGameContext();

	const getLetterWithNumber = (letter: string) => {
		return letterMapping?.find(item => item.letter === letter.toLowerCase());
	};

	const letterWithNumber = getLetterWithNumber(letter);

	return (
		<span
			className={cn(styles.letter, {
				[styles.found]: letterWithNumber?.isFound,
			})}
		>
			<input
				type="text"
				className={styles.letterInput}
				onChange={(event) => console.log(event.target.value)}
				maxLength={1}
				pattern="[a-zA-Z]"
			/>
			<span>{letter}</span>
			<span>{letterWithNumber?.number}</span>
		</span>
	);
};
