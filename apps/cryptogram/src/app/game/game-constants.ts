import { Quote } from "../types";

export const emptyQuote:Quote = {
  quote: null,
  author: null,
  html: null,
  category: null
} as const;