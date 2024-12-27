'use client';

import { useState, useEffect, useRef } from 'react';
import styles from './game.module.scss';
import type { Quote } from '../types';
import { emptyQuote } from './game-constants';
import { useQuoteApi } from '../hooks/use-quote-api';

export default function Index() {
  const [quote, setQuote] = useState<Quote>(emptyQuote);
  const { getRandomQuote } = useQuoteApi();

  useEffect(() => {
    getRandomQuote().then(setQuote);
  }, [getRandomQuote]);

  return (
    <div className={styles.game}>
      Game Page
      <p>{quote.quote}</p>
    </div>
  );
}
