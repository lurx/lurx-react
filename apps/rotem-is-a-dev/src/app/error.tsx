'use client';

import { CodeBlock } from '@/app/components';
import { ErrorPage } from '@/app/components/error-page';
import { ASCII_ERROR } from '@/ascii-art';
import './(main)/styles/global.scss';
import './root-error.css';

const SNIPPET = `\
try {
  await renderApplication();
} catch (error) {
  console.error("Something went wrong 😵");
  console.log("Don't worry, it's not you — it's us.");
  console.log("Our best engineers are on it! 🔧");
  throw new Error("500: UnexpectedError");
}

/* Suggestions:
 * - Click "Try again" below
 * - Refresh the page
 * - Come back in a few minutes
 */`;

const NUMBER_OF_LINES = 14;

export default function RootErrorPage({ error, reset }: ErrorPageProps) {
	return (
		<div className="root-error-container">
			<div className="root-error-inner-container">
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
			</div>
		</div>
	);
}
