'use client';

import { CodeBlock, ErrorPage } from '@/app/components';
import { ASCII_ERROR } from '@/ascii-art';

const SNIPPET = `\
const component = loadComponent('current-page');

try {
  component.render();
} catch (error) {
  console.error("This component hit a snag 😵");
  console.log("The rest of the site is fine though!");
  console.log("Try again or navigate somewhere else 🧭");
  throw new Error("ComponentRenderError");
}

/* Suggestions:
 * - Click "Try again" below
 * - Navigate to another page
 * - Refresh if the issue persists
 */`;

const NUMBER_OF_LINES = 16;

export default function MainErrorPage({ error, reset }: ErrorPageProps) {
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
