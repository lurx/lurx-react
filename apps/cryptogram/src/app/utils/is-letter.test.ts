import { isLetter } from './is-letter';
import { chance } from './test-helpers';

describe('isLetter', () => {
  it('should return true for a single letter', () => {
    const randomLetter = chance.character({ alpha: true });
    expect(isLetter('a')).toBe(true);
    expect(isLetter('A')).toBe(true);
  });

  it('should return false for anything other than a single letter', () => {
    expect(isLetter('')).toBe(false);
    expect(isLetter('aa')).toBe(false);
    expect(isLetter('1')).toBe(false);
    expect(isLetter('!')).toBe(false);
  });
});
