'use client';

import { Fragment, useMemo, useContext, PropsWithChildren } from 'react';
import { wordify } from '../../utils/wordify';
import { Word } from './word';
import styles from './board.module.scss';
import type { Quote } from '../../types';
import { useGameContext } from '../context/game-context';
import { Punctuation } from './punctuation';

export const Board = () => {
	const { quote, currentLetterIndex } = useGameContext();

	const wordedQuote = useMemo(() => wordify(quote?.quote ?? ''), [quote]);

	const rewordQuote = useMemo(() => {
		return wordedQuote.map((word, index) => {
			const key = word.content + '-' + index;
      const isPunctuation = word.type === 'punctuation';
      const isWord = word.type === 'word';
      const isNextWordPunctuation = wordedQuote[index + 1]?.type === 'punctuation';
      console.log({isNextWordPunctuation})
			if (isWord) {
				return (
					<Word
						key={key}
            wordIndex={index}
						word={word.content}
            punctuationAfter={!isPunctuation && isNextWordPunctuation}
					/>
				);
			}
			return <Punctuation key={key}>{word.content}</Punctuation>;
		});
	}, [wordedQuote]);


	return (
		<div className={styles.board}>
			<p>{quote?.quote}</p>
      <p>{currentLetterIndex}</p>
			{quote?.quote && <div className={styles.quote}>{rewordQuote}</div>}
		</div>
	);
};
