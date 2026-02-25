import type { PropsWithChildren } from 'react';
import { StatusPage } from '../status-page';
import { ErrorPageButton } from './error-page-button.component';
import type { ErrorPageProps } from './error-page.types';

export const ErrorPage = ({
	asciiArt,
	asciiArtLabel,
	reset,
	children,
}: PropsWithChildren<ErrorPageProps>) => {
	return (
		<StatusPage
			asciiArt={asciiArt}
			asciiArtLabel={asciiArtLabel}
		>
			{children}
			<ErrorPageButton reset={reset} />
		</StatusPage>
	);
};
