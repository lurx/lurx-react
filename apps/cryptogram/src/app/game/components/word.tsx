import { useGameContext } from '../context/game-context';
import { Letter } from './letter';
import styles from './word.module.scss';
import cn from 'classnames';

type WordProps = {
	word: string;
  wordIndex: number;
	punctuationAfter?: boolean;
}

export const Word = ({
	word,
  wordIndex,
	punctuationAfter,
}: WordProps) => {

  const { currentLetterIndex } = useGameContext();

	return (
		<div className={cn(styles.word, { [styles.punctuationAfter]: punctuationAfter })}>
			{word.split('').map((letter, index) => {
        const letterIndex = index;
        return (
				<Letter
					key={`${letter}-${index}`}
          index={index}
					letter={letter}
				/>
			)})}
		</div>
	);
};
