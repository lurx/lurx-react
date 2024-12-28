const wordTypes = {
  word: 'word',
  number: 'number',
  punctuation: 'punctuation',
} as const;

type WordType = typeof wordTypes[keyof typeof wordTypes];

type WordifyReturn = {
  content: string;
  type: WordType;
}

const regexes = {
  word: /\w/,
  number: /\d/,
  punctuation: /[^\s\w]/,
}

export const wordify = (text: string): WordifyReturn[] => {
  const words = text.match(/[\w]+|[^\s\w]+|\s/g);
  if (!words) {
    return [];
  }

  const wordified = words.reduce((acc: WordifyReturn[], word) => {
    let type:WordType = wordTypes.punctuation;
    if (regexes.number.test(word)) {
      type = wordTypes.number
    } else if (regexes.word.test(word)) {
        type = wordTypes.word;
    }

    const result: WordifyReturn = {
      content: word,
      type,
    };

    acc.push(result);

    return acc;
  }, []);

  return wordified;
}