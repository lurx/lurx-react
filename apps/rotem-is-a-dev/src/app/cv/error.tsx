'use client';

import { CodeBlock } from '@/app/components';
import { ErrorPage } from '@/app/components/error-page';
import { ASCII_ERROR } from '@/ascii-art';

const SNIPPET = `\
const cv = await generateCV(profile);

try {
  await cv.renderToPDF();
} catch (error) {
  console.error("Failed to load the CV page 😵");
  console.log("PDF rendering or fonts may have failed.");
  console.log("Give it another shot! 🔄");
  throw new Error("CVRenderError");
}

/* Suggestions:
 * - Click "Try again" below
 * - Go back to the homepage
 * - Try a different browser
 */`;

const NUMBER_OF_LINES = 16;

export default function CVErrorPage({ error, reset }: ErrorPageProps) {
	return (
		<ErrorPage
			asciiArt={ASCII_ERROR}
			asciiArtLabel="Error"
			error={error}
			reset={reset}
		>
			<CodeBlock
				code={SNIPPET}
				language="typescript"
				numberOfLines={NUMBER_OF_LINES}
			/>
		</ErrorPage>
	);
}
