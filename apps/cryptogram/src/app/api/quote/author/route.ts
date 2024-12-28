import zenQuotes from '../../zen-quotes.json';
import {transformQuotes } from '../../api-utils';
import { getRandomArrayIndex } from '../../../utils';

export async function GET(request: Request) {
  const quotes = transformQuotes(zenQuotes);
  const author = request.url.split('/').pop();
  const authorQuotes = quotes.filter((quote) => quote.author === author);
  const randomIndex = getRandomArrayIndex(authorQuotes);
  const randomQuote = authorQuotes[randomIndex];
  const jsonResp = JSON.stringify(randomQuote);
  return new Response(jsonResp);
}
