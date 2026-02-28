type ErrorPageProps = {
	readonly error: Error & { digest?: string };
	readonly reset: () => void;
}
