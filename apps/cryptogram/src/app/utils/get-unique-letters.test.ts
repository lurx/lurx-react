import { getOnlyLettersFromString, getUniqueLetters } from './get-unique-letters';
import Chance from 'chance';

const chance = new Chance();
const testArray = new Array(10).fill(null).map(() => chance.string());
describe('getOnlyLettersFromString', () => {
  it.each(testArray)('should return a set of unique letters for string "%s"', (string:string) => {
    const result = getOnlyLettersFromString(string);
    const onlyLetters = string.replace(/[^a-zA-Z]/g, '');
    expect(result).toEqual(onlyLetters);
});
});

describe('getUniqueLetters', () => {
  it.each(testArray)('should return a set of unique letters for string "%s"', (string:string) => {
    const result = getUniqueLetters(string);
    const onlyLetters = string.replace(/[^a-zA-Z]/g, '');
    const uniqueLetters = new Set(onlyLetters.toLowerCase().trim().split(''));
    expect(result).toEqual(uniqueLetters);
  });
});