'use client';

import { useCallback, useMemo } from 'react';
import { wordify } from '../../utils/wordify';
import { Word } from './word';
import styles from './board.module.scss';
// import { useGameContext } from '../context/game-context';
import { Punctuation } from './punctuation';
import { LetterWithAssignedNumber } from '../../types';
import { useGameContext } from '../context/game-store';

export const Board = () => {
	const { quote, currentLetterIndex, uniqueLetterMap, quoteLetterMapping } =
		useGameContext();

	const wordedQuote = useMemo(() => wordify(quote?.quote ?? ''), [quote]);

	const rewordQuote = useMemo(() => {
		return wordedQuote.map((word, index) => {
			const key = word.content + '-' + index;
			const isPunctuation = word.type === 'punctuation';
			const isWord = word.type === 'word';
			const isNextWordPunctuation =
				wordedQuote[index + 1]?.type === 'punctuation';
			console.log({ isNextWordPunctuation });
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

	// create a table from uniqueLetterMap

	const Table = ({
		map,
		debug,
	}: {
		map: LetterWithAssignedNumber[];
		debug?: boolean;
	}) => {
		if (debug) {
			console.log({ map });
		}
		return (
			<table style={{ fontSize: '12px' }}>
				<thead>
					<tr>
						<th>Letter</th>
						<th>Number</th>
						<th>Found</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						{map?.map(item => (
							<td key={JSON.stringify(item)}>
								{item.letter} <br />
								{item.number} <br />
								{item.isFound ? 'true' : 'false'} <br />
								{item.isSolved ? 'true' : 'false'}
							</td>
						))}
					</tr>
				</tbody>
			</table>
		);
	};

	return (
		<div className={styles.board}>
			<p>{quote?.quote}</p>
			<p>{currentLetterIndex}</p>
			{quote?.quote && <div className={styles.quote}>{rewordQuote}</div>}
			<div>{uniqueLetterMap && <Table map={uniqueLetterMap} />}</div>
			<div>
				quote map: <br />
				{quoteLetterMapping && <Table map={quoteLetterMapping} />}
			</div>
		</div>
	);
};
