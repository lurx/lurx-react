import type { Quote, ZenQuote } from "../types";

export const transformQuotes = (quotes: ZenQuote[]): Quote[] => {
  return quotes.map((zenQuote) => ({
      quote: zenQuote.q,
      author: zenQuote.a,
      html: zenQuote.h,
      category: zenQuote.c,
  }));
}

export const quoteApiPaths = {
  random: '/api/quote/random/',
}