export type Nullable<T> = T | null;

export type ZenQuote = {
  q: string;
  a: string;
  h: string;
  c: string;
}

export type Quote = {
  quote: Nullable<string>;
  author: Nullable<string>;
  html: Nullable<string>;
  category: Nullable<string>;
}
