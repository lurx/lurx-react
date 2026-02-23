import type { PropsWithChildren } from 'react';

export interface StatusPageProps {
	asciiArt: string;
	asciiArtLabel?: string;
}

export type StatusPageComponentProps = PropsWithChildren<StatusPageProps>;
