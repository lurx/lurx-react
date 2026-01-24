import { render, screen } from '@testing-library/react';
import { StoryWiseProvider, useStoryWise } from '../story-wise-context';

jest.mock('../../hooks/use-ffmpeg', () => ({
	useFFmpeg: () => ({
		load: jest.fn().mockResolvedValue(undefined),
		splitVideo: jest.fn(),
		getMetadata: jest.fn(),
		isLoaded: false,
		terminate: jest.fn(),
	}),
}));

function Consumer() {
	const ctx = useStoryWise();
	return (
		<div>
			<span data-testid="status">{ctx.processingStatus}</span>
			<span data-testid="online">{String(ctx.serviceStatus.online)}</span>
		</div>
	);
}

describe('StoryWiseContext', () => {
	beforeEach(() => {
		(global.fetch as jest.Mock) = jest.fn().mockResolvedValue({
			ok: true,
			json: async () => ({ online: true }),
		});
	});

	it('useStoryWise throws when used outside Provider', () => {
		// Suppress React error boundary logging in test
		const spy = jest.spyOn(console, 'error').mockImplementation(() => {});

		expect(() => render(<Consumer />)).toThrow(
			/useStoryWise must be used within a <StoryWiseProvider>/
		);

		spy.mockRestore();
	});

	it('provides default context values when inside Provider', async () => {
		render(
			<StoryWiseProvider>
				<Consumer />
			</StoryWiseProvider>
		);

		await screen.findByTestId('status');
		expect(screen.getByTestId('status')).toHaveTextContent('idle');
		expect(screen.getByTestId('online')).toHaveTextContent('true');
	});
});
