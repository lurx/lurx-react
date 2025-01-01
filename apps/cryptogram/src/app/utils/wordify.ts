import { RegexTypes } from "./utils.constants";

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


export const wordify = (text: string): WordifyReturn[] => {
  const words = text.match(/[\w]+|[^\s\w]+|\s/g);
  if (!words) {
    return [];
  }

  const wordified = words.reduce((acc: WordifyReturn[], word) => {
    let type:WordType = wordTypes.punctuation;
    if (RegexTypes.number.test(word)) {
      type = wordTypes.number
    } else if (RegexTypes.word.test(word)) {
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