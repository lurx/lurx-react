import type { StatusPageProps } from "../status-page";

export type ErrorPageProps = Pick<StatusPageProps, 'asciiArt' | 'asciiArtLabel'> & {
  readonly error: Error & { digest?: string };
  readonly reset: () => void;
}
