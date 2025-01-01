import { LetterWithAssignedNumber } from "../types";
import { getUniqueLetters } from "./get-unique-letters";

const getRandomNumberForLetter = () => Math.floor(Math.random() * 26) + 1;

export const assignNumbers = (string?: string): LetterWithAssignedNumber[] => {
  if (!string) {
    return [];
  }
  // const letters = string.toLowerCase().trim().split('');
  const uniqueLetters = getUniqueLetters(string);
  // assign random UNIQUE numbers, between 1-26 to UNIQUE letters
  const usedNumbers:number[] = [];
  const assignedNumbers = Array.from(uniqueLetters).map((letter) => {
    let number = getRandomNumberForLetter();

    while (usedNumbers.includes(number)) {
      number = getRandomNumberForLetter();
    }

    return {
      letter,
      number,
    }
  });
console.log({string, assignedNumbers})
  return assignedNumbers;
}
