import { RegexTypes } from "./utils.constants";

export const getOnlyLettersFromString = (string: string) => string.replace(/[^a-zA-Z]/g, '');

export const getUniqueLetters = (string: string) => {
  const onlyLetters = getOnlyLettersFromString(string);
  const uniqueLetters = new Set(onlyLetters.toLowerCase().trim().split(''));
  return uniqueLetters;
}
