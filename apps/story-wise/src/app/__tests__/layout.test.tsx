import { render, screen } from '@testing-library/react';
import RootLayout from '../layout';

jest.mock('../hooks/use-ffmpeg', () => ({
	useFFmpeg: () => ({
		load: jest.fn().mockResolvedValue(undefined),
		splitVideo: jest.fn(),
		getMetadata: jest.fn(),
		isLoaded: false,
		terminate: jest.fn(),
	}),
}));

beforeEach(() => {
	(global.fetch as jest.Mock) = jest.fn().mockResolvedValue({
		ok: true,
		json: async () => ({ online: true }),
	});
});

describe('RootLayout', () => {
	it('renders Header with Story Wise link', () => {
		render(
			<RootLayout>
				<span data-testid="child">Child</span>
			</RootLayout>
		);
		expect(screen.getByRole('banner')).toBeInTheDocument();
		expect(screen.getByRole('link', { name: /story wise/i })).toHaveAttribute('href', '/');
	});

	it('renders children inside the layout', () => {
		render(
			<RootLayout>
				<span data-testid="child">Child</span>
			</RootLayout>
		);
		expect(screen.getByTestId('child')).toHaveTextContent('Child');
	});
});
