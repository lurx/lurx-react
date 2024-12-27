import { transformQuotes } from './api-utils';

describe('transformQuotes', () => {
  it('should transform ZenQuotes to Quotes', () => {
    const zenQuotes = [{
      q: 'quote 1',
      a: 'author 1',
      h: 'html 1',
      c: 'category 1',
    }];

    const expectedQuotes = [{
      quote: 'quote 1',
      author: 'author 1',
      html: 'html 1',
      category: 'category 1',
    }];

    expect(transformQuotes(zenQuotes)).toEqual(expectedQuotes);
  });
});
