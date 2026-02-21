import { fireEvent, render, screen } from '@testing-library/react';
import { AccessibilityWidget } from '../accessibility-widget.component';
import { BASE_FONT_SIZE_PX, TEXT_SCALE_STORAGE_KEY } from '../accessibility-widget.types';

const mockGetItem = jest.mocked(localStorage.getItem);
const mockSetItem = jest.mocked(localStorage.setItem);

beforeEach(() => {
	mockGetItem.mockReset();
	mockSetItem.mockReset();
	document.documentElement.style.removeProperty('--root-font-size');
});

describe('AccessibilityWidget', () => {
	it('renders the accessibility button', () => {
		render(<AccessibilityWidget />);
		expect(
			screen.getByRole('button', { name: 'Accessibility options' }),
		).toBeInTheDocument();
	});

	it('does not show the panel initially', () => {
		render(<AccessibilityWidget />);
		expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
	});

	it('toggles the panel on button click', () => {
		render(<AccessibilityWidget />);
		const trigger = screen.getByRole('button', {
			name: 'Accessibility options',
		});

		fireEvent.click(trigger);
		expect(screen.getByRole('dialog')).toBeInTheDocument();

		fireEvent.click(trigger);
		expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
	});

	it('sets aria-expanded on the trigger button', () => {
		render(<AccessibilityWidget />);
		const trigger = screen.getByRole('button', {
			name: 'Accessibility options',
		});

		expect(trigger).toHaveAttribute('aria-expanded', 'false');

		fireEvent.click(trigger);
		expect(trigger).toHaveAttribute('aria-expanded', 'true');
	});

	it('shows 100% as default text scale', () => {
		render(<AccessibilityWidget />);
		fireEvent.click(
			screen.getByRole('button', { name: 'Accessibility options' }),
		);

		expect(screen.getByText('100%')).toBeInTheDocument();
	});

	it('increases text scale on plus click', () => {
		render(<AccessibilityWidget />);
		fireEvent.click(
			screen.getByRole('button', { name: 'Accessibility options' }),
		);

		fireEvent.click(
			screen.getByRole('button', { name: 'Increase text size' }),
		);

		expect(screen.getByText('125%')).toBeInTheDocument();
	});

	it('decreases text scale on minus click', () => {
		render(<AccessibilityWidget />);
		fireEvent.click(
			screen.getByRole('button', { name: 'Accessibility options' }),
		);

		// Increase first
		fireEvent.click(
			screen.getByRole('button', { name: 'Increase text size' }),
		);
		expect(screen.getByText('125%')).toBeInTheDocument();

		// Now decrease
		fireEvent.click(
			screen.getByRole('button', { name: 'Decrease text size' }),
		);
		expect(screen.getByText('100%')).toBeInTheDocument();
	});

	it('disables decrease button at minimum scale', () => {
		render(<AccessibilityWidget />);
		fireEvent.click(
			screen.getByRole('button', { name: 'Accessibility options' }),
		);

		expect(
			screen.getByRole('button', { name: 'Decrease text size' }),
		).toBeDisabled();
	});

	it('disables increase button at maximum scale', () => {
		render(<AccessibilityWidget />);
		fireEvent.click(
			screen.getByRole('button', { name: 'Accessibility options' }),
		);

		// Click increase 4 times to reach 200%
		const increaseButton = screen.getByRole('button', {
			name: 'Increase text size',
		});
		fireEvent.click(increaseButton);
		fireEvent.click(increaseButton);
		fireEvent.click(increaseButton);
		fireEvent.click(increaseButton);

		expect(screen.getByText('200%')).toBeInTheDocument();
		expect(increaseButton).toBeDisabled();
	});

	it('resets text scale to default', () => {
		render(<AccessibilityWidget />);
		fireEvent.click(
			screen.getByRole('button', { name: 'Accessibility options' }),
		);

		fireEvent.click(
			screen.getByRole('button', { name: 'Increase text size' }),
		);
		expect(screen.getByText('125%')).toBeInTheDocument();

		fireEvent.click(
			screen.getByRole('button', { name: 'Reset text size to default' }),
		);
		expect(screen.getByText('100%')).toBeInTheDocument();
	});

	it('disables reset button when at default scale', () => {
		render(<AccessibilityWidget />);
		fireEvent.click(
			screen.getByRole('button', { name: 'Accessibility options' }),
		);

		expect(
			screen.getByRole('button', { name: 'Reset text size to default' }),
		).toBeDisabled();
	});

	it('persists text scale to localStorage on change', () => {
		render(<AccessibilityWidget />);
		fireEvent.click(
			screen.getByRole('button', { name: 'Accessibility options' }),
		);

		fireEvent.click(
			screen.getByRole('button', { name: 'Increase text size' }),
		);

		expect(mockSetItem).toHaveBeenCalledWith(
			TEXT_SCALE_STORAGE_KEY,
			JSON.stringify(125),
		);
	});

	it('restores text scale from localStorage on mount', () => {
		mockGetItem.mockReturnValue(JSON.stringify(150));

		render(<AccessibilityWidget />);
		fireEvent.click(
			screen.getByRole('button', { name: 'Accessibility options' }),
		);

		expect(screen.getByText('150%')).toBeInTheDocument();
	});

	it('closes the panel on Escape key', () => {
		render(<AccessibilityWidget />);
		fireEvent.click(
			screen.getByRole('button', { name: 'Accessibility options' }),
		);
		expect(screen.getByRole('dialog')).toBeInTheDocument();

		fireEvent.keyDown(document, { key: 'Escape' });
		expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
	});

	it('closes the panel on outside click', () => {
		render(
			<div>
				<div data-testid="outside">outside</div>
				<AccessibilityWidget />
			</div>,
		);
		fireEvent.click(
			screen.getByRole('button', { name: 'Accessibility options' }),
		);
		expect(screen.getByRole('dialog')).toBeInTheDocument();

		fireEvent.mouseDown(screen.getByTestId('outside'));
		expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
	});

	it('applies --root-font-size on mount from stored value', () => {
		mockGetItem.mockReturnValue(JSON.stringify(175));

		render(<AccessibilityWidget />);

		expect(
			document.documentElement.style.getPropertyValue('--root-font-size'),
		).toBe(`${(BASE_FONT_SIZE_PX * 175) / 100}px`);
	});
});
