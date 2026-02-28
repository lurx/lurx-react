import type { PropsWithChildren } from 'react';

export type StatusPageProps = {
	asciiArt: string;
	asciiArtLabel?: string;
}

export type StatusPageComponentProps = PropsWithChildren<StatusPageProps>;
