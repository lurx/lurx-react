import { render, screen } from '@testing-library/react';
import { useResponsive } from '@/hooks';
import { GistPanel } from '../gist-panel.component';

jest.mock('@/hooks', () => ({
	useResponsive: jest.fn(),
}));

const mockUseResponsive = useResponsive as jest.Mock;

beforeEach(() => {
	mockUseResponsive.mockReturnValue({ isMobile: false, isTablet: false, isDesktop: true });
});

jest.mock('@/lib/shiki', () => ({
	useShikiTokens: ({ code }: { code: string }) =>
		code.split('\n').map((line: string) => ({
			tokens: [{ content: line, color: '#d6deeb' }],
		})),
}));

jest.mock('@/app/components', () => ({
	...jest.requireActual('@/app/components'),
	FaIcon: ({ iconName }: { iconName: string }) => (
		<span data-testid="icon">{iconName}</span>
	),
}));

describe('GistPanel', () => {
	it('renders the panel title', () => {
		render(<GistPanel />);
		expect(screen.getByText('// Code snippet showcase:')).toBeInTheDocument();
	});

	it('renders two gist snippet cards', () => {
		render(<GistPanel />);
		const usernames = screen.getAllByText('@lurx');
		expect(usernames).toHaveLength(2);
	});

	it('renders created-at timestamps for each snippet', () => {
		render(<GistPanel />);
		expect(screen.getByText('Created 5 months ago')).toBeInTheDocument();
		expect(screen.getByText('Created 9 months ago')).toBeInTheDocument();
	});

	it('renders details and stars actions for each snippet', () => {
		render(<GistPanel />);
		const detailsLabels = screen.getAllByText(/details/);
		const starsLabels = screen.getAllByText(/stars/);
		expect(detailsLabels).toHaveLength(2);
		expect(starsLabels).toHaveLength(2);
	});

	it('renders the debounce code block', () => {
		render(<GistPanel />);
		expect(screen.getByLabelText('debounce content')).toBeInTheDocument();
	});

	it('renders the chunk code block', () => {
		render(<GistPanel />);
		expect(screen.getByLabelText('chunk content')).toBeInTheDocument();
	});

	it('renders nothing on mobile', () => {
		mockUseResponsive.mockReturnValue({ isMobile: true, isTablet: false, isDesktop: false });
		const { container } = render(<GistPanel />);
		expect(container.innerHTML).toBe('');
	});
});
