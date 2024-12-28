import { Letter } from './letter';
import styles from './word.module.scss';
import cn from 'classnames';

type WordProps = {
	word: string;
	punctuationAfter?: boolean;
}

export const Word = ({
	word,
	punctuationAfter,
}: WordProps) => {
	return (
		<div className={cn(styles.word, { [styles.punctuationAfter]: punctuationAfter })}>
			{word.split('').map((letter, index) => (
				<Letter
					key={`${letter}-${index}`}
					letter={letter}
				/>
			))}
		</div>
	);
};
