import { transformQuotes } from '../../api-utils';
import zenQuotes from '../../zen-quotes.json';

export async function GET(request: Request) {
  const quotes = transformQuotes(zenQuotes);
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];
  const jsonResp = JSON.stringify(randomQuote);
  return new Response(jsonResp);
}
