export type Nullable<T> = T | null;

export type ZenQuote = {
  q: string;
  a: string;
  h: string;
  c: string;
}

export type Quote = Nullable<{
  quote: string;
  author: string;
  html: string;
  category: string;
}>
