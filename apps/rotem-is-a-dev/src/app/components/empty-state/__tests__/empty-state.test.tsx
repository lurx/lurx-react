import { render, screen } from '@testing-library/react';
import { EmptyState } from '../empty-state.component';
import {
	EMPTY_STATE_VARIANTS,
	EMPTY_STATE_ASCII_ART_MAP,
	EMPTY_STATE_ASCII_LABELS_MAP,
	EMPTY_STATE_MOBILE_ASCII_ART_MAP,
} from '../empty-state.constants';
import { useResponsive } from '@/hooks';

jest.mock('@/hooks', () => ({
	useResponsive: jest.fn(),
}));

jest.mock('../../ascii-art-renderer', () => ({
	AsciiArtRenderer: ({
		asciiArt,
		asciiArtLabel,
	}: {
		asciiArt: string;
		asciiArtLabel?: string;
	}) => (
		<pre data-testid="ascii-art-renderer" aria-label={asciiArtLabel}>
			{asciiArt}
		</pre>
	),
}));

const mockUseResponsive = useResponsive as jest.Mock;

beforeEach(() => {
	mockUseResponsive.mockReturnValue({
		isMobile: false,
		isTablet: false,
		isDesktop: true,
	});
});

describe('EmptyState', () => {
	it('renders children text', () => {
		render(
			<EmptyState variant={EMPTY_STATE_VARIANTS.NO_DATA}>
				No data available
			</EmptyState>,
		);

		expect(screen.getByText('No data available')).toBeInTheDocument();
	});

	it('passes the correct ascii art for NO_DATA variant', () => {
		render(
			<EmptyState variant={EMPTY_STATE_VARIANTS.NO_DATA}>
				No data
			</EmptyState>,
		);

		const renderer = screen.getByTestId('ascii-art-renderer');
		expect(renderer.textContent).toBe(
			EMPTY_STATE_ASCII_ART_MAP[EMPTY_STATE_VARIANTS.NO_DATA],
		);
	});

	it('passes the correct ascii art for NO_POSTS variant', () => {
		render(
			<EmptyState variant={EMPTY_STATE_VARIANTS.NO_POSTS}>
				No posts
			</EmptyState>,
		);

		const renderer = screen.getByTestId('ascii-art-renderer');
		expect(renderer.textContent).toBe(
			EMPTY_STATE_ASCII_ART_MAP[EMPTY_STATE_VARIANTS.NO_POSTS],
		);
	});

	it('passes the correct ascii art label for NO_DATA variant', () => {
		render(
			<EmptyState variant={EMPTY_STATE_VARIANTS.NO_DATA}>
				No data
			</EmptyState>,
		);

		const renderer = screen.getByTestId('ascii-art-renderer');
		expect(renderer).toHaveAttribute(
			'aria-label',
			EMPTY_STATE_ASCII_LABELS_MAP[EMPTY_STATE_VARIANTS.NO_DATA],
		);
	});

	it('passes the correct ascii art label for NO_POSTS variant', () => {
		render(
			<EmptyState variant={EMPTY_STATE_VARIANTS.NO_POSTS}>
				No posts
			</EmptyState>,
		);

		const renderer = screen.getByTestId('ascii-art-renderer');
		expect(renderer).toHaveAttribute(
			'aria-label',
			EMPTY_STATE_ASCII_LABELS_MAP[EMPTY_STATE_VARIANTS.NO_POSTS],
		);
	});

	it('renders children as JSX elements', () => {
		render(
			<EmptyState variant={EMPTY_STATE_VARIANTS.NO_DATA}>
				<span data-testid="custom-child">Custom content</span>
			</EmptyState>,
		);

		expect(screen.getByTestId('custom-child')).toBeInTheDocument();
		expect(screen.getByText('Custom content')).toBeInTheDocument();
	});

	it('wraps children in a paragraph element', () => {
		const { container } = render(
			<EmptyState variant={EMPTY_STATE_VARIANTS.NO_DATA}>
				Some message
			</EmptyState>,
		);

		const paragraph = container.querySelector('p');
		expect(paragraph).toBeInTheDocument();
		expect(paragraph?.textContent).toBe('Some message');
	});

	it('renders the AsciiArtRenderer component', () => {
		render(
			<EmptyState variant={EMPTY_STATE_VARIANTS.NO_DATA}>
				Content
			</EmptyState>,
		);

		expect(screen.getByTestId('ascii-art-renderer')).toBeInTheDocument();
	});

	it('uses mobile ascii art map on mobile devices', () => {
		mockUseResponsive.mockReturnValue({
			isMobile: true,
			isTablet: false,
			isDesktop: false,
		});

		render(
			<EmptyState variant={EMPTY_STATE_VARIANTS.NO_DATA}>
				No data
			</EmptyState>,
		);

		const renderer = screen.getByTestId('ascii-art-renderer');
		expect(renderer.textContent).toBe(
			EMPTY_STATE_MOBILE_ASCII_ART_MAP[EMPTY_STATE_VARIANTS.NO_DATA],
		);
	});

	it('uses mobile ascii art map on tablet devices', () => {
		mockUseResponsive.mockReturnValue({
			isMobile: false,
			isTablet: true,
			isDesktop: false,
		});

		render(
			<EmptyState variant={EMPTY_STATE_VARIANTS.NO_POSTS}>
				No posts
			</EmptyState>,
		);

		const renderer = screen.getByTestId('ascii-art-renderer');
		expect(renderer.textContent).toBe(
			EMPTY_STATE_MOBILE_ASCII_ART_MAP[EMPTY_STATE_VARIANTS.NO_POSTS],
		);
	});

	it('uses desktop ascii art map on desktop devices', () => {
		render(
			<EmptyState variant={EMPTY_STATE_VARIANTS.NO_DATA}>
				No data
			</EmptyState>,
		);

		const renderer = screen.getByTestId('ascii-art-renderer');
		expect(renderer.textContent).toBe(
			EMPTY_STATE_ASCII_ART_MAP[EMPTY_STATE_VARIANTS.NO_DATA],
		);
	});
});
