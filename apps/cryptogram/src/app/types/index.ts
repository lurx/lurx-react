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

export type LetterWithAssignedNumber = {
  letter: string;
  number: number;
  isFound?: boolean;
  isSolved?: boolean;
}

export type RequireAll<Type> = {
  [Prop in keyof Type]-?: Type[Prop];
}

export type RequiredSome<Type, Keys extends keyof Type> = {
  [Prop in Keys]-?: Type[Prop];
} & {
  [Prop in Exclude<keyof Type, Keys>]?: Type[Prop];
}