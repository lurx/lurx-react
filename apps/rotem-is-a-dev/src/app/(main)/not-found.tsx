import { ServerCodeBlock } from '@/app/components/code-block/server-code-block.component';
import { StatusPage } from '@/app/components/status-page';

const ASCII_404 = `\
 ██╗  ██╗ ██████╗ ██╗  ██╗
 ██║  ██║██╔═████╗██║  ██║
 ███████║██║██╔██║███████║
 ╚════██║████╔╝██║╚════██║
      ██║╚██████╔╝     ██║
      ╚═╝ ╚═════╝      ╚═╝`;

const SNIPPET = `\
const page = findPage('you-were-looking-for');

if (!page) {
  console.log("Oops! Looks like you took a wrong turn in the codebase.");
  console.log("But hey, since you're here ...");
  console.log("🔍 Go back to the homepage and explore more cool stuff!");
  throw new Error("404: PageNotFoundError 😢");
}

/* Suggestions:
 * - Check the URL for typos
 * - Use the site navigation
 * - Or hit CMD+Z in real life 😅
 */

redirect('home');`;

const NUMBER_OF_LINES = 22;

export default function NotFound() {
	return (
		<StatusPage
			asciiArt={ASCII_404}
			asciiArtLabel="404"
		>
			<ServerCodeBlock
				code={SNIPPET}
				language="typescript"
				numberOfLines={NUMBER_OF_LINES}
			/>
		</StatusPage>
	);
}
