import { useCallback } from "react";
import type { Quote } from "../types";
import { emptyQuote } from "../game/game-constants";

export const useQuoteApi = () => {

  const getRandomQuote = useCallback(async () => {
    try {
      const response = await fetch('/api/quote/random/');
      const responseQuote:Quote = await response.json();
      return responseQuote;
    } catch (error) {
      console.error('Error fetching quote:', error);
      return emptyQuote;
    }
  }, []);

  return {getRandomQuote};
}
