import { getRandomArrayIndex } from '.';

describe('getRandomArrayIndex', () => {
  it('should return 0 for an empty array', ()=> {
    expect(getRandomArrayIndex([])).toBe(0);
  });

  it('should return an integer that is <= to array.length', () => {
    const randomLength = Math.random() * 100;
    const randomArray = Array.from({ length: randomLength }, (_, i) => i);
    expect(getRandomArrayIndex(randomArray)).toBeLessThanOrEqual(randomArray.length);
  })
})
