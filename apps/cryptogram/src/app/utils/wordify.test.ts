import { wordify } from './wordify';
// const example = 'Hello, world! I will have been born in the year 2828.';

const testStrings = [
  'Hello world',
  'Hello, world!',
  'Something happened in 1982.',
  'Execute order 66!'
]

const expectedResults = [
  [
    {
      content: 'Hello',
      type: 'word'
    },
    {
      content: ' ',
      type: 'punctuation'
    },
    {
      content: 'world',
      type: 'word'
    }
  ],
  [
    {
      content: 'Hello',
      type: 'word'
    },
    {
      content: ',',
      type: 'punctuation'
    },
    {
      content: ' ',
      type: 'punctuation'
    },
    {
      content: 'world',
      type: 'word'
    },
    {
      content: '!',
      type: 'punctuation'
    }
  ],
  [
    {
      content: 'Something',
      type: 'word'
    },
    {
      content: ' ',
      type: 'punctuation'
    },
    {
      content: 'happened',
      type: 'word'
    },
    {
      content: ' ',
      type: 'punctuation'
    },
    {
      content: 'in',
      type: 'word'
    },
    {
      content: ' ',
      type: 'punctuation'
    },
    {
      content: '1982',
      type: 'number'
    },
    {
      content: '.',
      type: 'punctuation'
    }
  ],
  [
    {
      content: 'Execute',
      type: 'word'
    },
    {
      content: ' ',
      type: 'punctuation'
    },
    {
      content: 'order',
      type: 'word'
    },
    {
      content: ' ',
      type: 'punctuation'
    },
    {
      content: '66',
      type: 'number'
    },
    {
      content: '!',
      type: 'punctuation'
    }
  ]
]

describe('wordify', () => {
  it.each(testStrings)('should break the text "%s" into words', (testString) => {
    const indexOfTestString = testStrings.indexOf(testString);
    const expected = expectedResults[indexOfTestString];
    expect(wordify(testString)).toEqual(expected);
  });
});