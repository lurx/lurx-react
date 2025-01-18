export const isLetter = (char: string) => {
  return char.length === 1 && char.match(/[a-zA-Z]/);
};