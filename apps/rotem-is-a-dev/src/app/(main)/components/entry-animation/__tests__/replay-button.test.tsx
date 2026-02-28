import { fireEvent, render, screen } from '@testing-library/react';

const mockTriggerReplay = jest.fn();
let mockIsShellLoaded = true;
let mockIsMobile = false;

jest.mock('@/hooks', () => ({
	useResponsive: () => ({ isMobile: mockIsMobile }),
}));

jest.mock('../entry-animation.context', () => ({
	useEntryAnimation: () => ({
		isShellLoaded: mockIsShellLoaded,
		triggerReplay: mockTriggerReplay,
		setIsShellLoaded: jest.fn(),
		animationKey: 0,
	}),
}));

jest.mock('@/app/components', () => ({
	FaIcon: ({
		iconName,
		iconGroup,
	}: {
		iconName: string;
		iconGroup: string;
	}) => (
		<span data-testid="fa-icon" data-icon={iconName} data-group={iconGroup} />
	),
}));

import { ReplayButton } from '../replay-button.component';

beforeEach(() => {
	mockTriggerReplay.mockClear();
	mockIsShellLoaded = true;
	mockIsMobile = false;
});

describe('ReplayButton', () => {
	it('renders the button when shell is loaded and not mobile', () => {
		render(<ReplayButton />);
		expect(
			screen.getByRole('button', { name: 'Replay intro animation' }),
		).toBeInTheDocument();
	});

	it('returns null when on mobile', () => {
		mockIsMobile = true;
		const { container } = render(<ReplayButton />);
		expect(container).toBeEmptyDOMElement();
	});

	it('returns null when shell is not loaded', () => {
		mockIsShellLoaded = false;
		const { container } = render(<ReplayButton />);
		expect(container).toBeEmptyDOMElement();
	});

	it('returns null when on mobile even if shell is loaded', () => {
		mockIsMobile = true;
		mockIsShellLoaded = true;
		const { container } = render(<ReplayButton />);
		expect(container).toBeEmptyDOMElement();
	});

	it('calls triggerReplay when the button is clicked', () => {
		render(<ReplayButton />);
		fireEvent.click(screen.getByRole('button', { name: 'Replay intro animation' }));
		expect(mockTriggerReplay).toHaveBeenCalledTimes(1);
	});

	it('renders the FaIcon inside the button', () => {
		render(<ReplayButton />);
		expect(screen.getByTestId('fa-icon')).toBeInTheDocument();
	});

	it('renders the FaIcon with arrow-rotate-right icon', () => {
		render(<ReplayButton />);
		expect(screen.getByTestId('fa-icon')).toHaveAttribute(
			'data-icon',
			'arrow-rotate-right',
		);
	});

	it('renders the FaIcon with fal icon group', () => {
		render(<ReplayButton />);
		expect(screen.getByTestId('fa-icon')).toHaveAttribute('data-group', 'fal');
	});

	it('has a title attribute on the button', () => {
		render(<ReplayButton />);
		expect(
			screen.getByRole('button', { name: 'Replay intro animation' }),
		).toHaveAttribute('title', 'Replay intro animation');
	});

	it('button has type="button"', () => {
		render(<ReplayButton />);
		expect(
			screen.getByRole('button', { name: 'Replay intro animation' }),
		).toHaveAttribute('type', 'button');
	});
});
