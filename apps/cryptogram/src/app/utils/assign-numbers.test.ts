import { assignNumbers } from './assign-numbers.util';
import { chance } from './test-helpers.ts';
import { getUniqueLetters } from './get-unique-letters';

const chanceString = () => chance.string({
  pool: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ,.!?\'"&',
});
describe('assignNumbers', () => {
  it('should return a set the same size as the unique letters in the string', () => {
    // Arrange
    const string = chanceString();
    // const string = 'hello';
    // Act
    const result = assignNumbers(string);
    // const allUniqueNumbers = new Set(result.map((item) => item.number));
    // Assert
    const uniqueLetters = new Set(string.toLowerCase().trim().split(''));
    expect(result.length).toEqual(uniqueLetters.size);

  });

  it('all numbers in returned array should be unique', () => {
    // Arrange
    const string = chanceString();
    // Act
    const result = assignNumbers(string);
    const uniqueLetters = getUniqueLetters(string);
    // Assert
    expect(result.length).toEqual(uniqueLetters.size);
  });

  it('all assigned numbers should be between 1 and 26', () => {
    // Arrange
    const string = chanceString();
    // Act
    const result = assignNumbers(string);
    const allNumbersInRange = result.every((item) => item.number >= 1 && item.number <= 26);
    // Assert
    expect(allNumbersInRange).toBe(true);
  });
});

