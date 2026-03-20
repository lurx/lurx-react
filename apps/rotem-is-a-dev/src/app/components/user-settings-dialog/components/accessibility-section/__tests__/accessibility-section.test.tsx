import { fireEvent, render, screen } from '@testing-library/react';

jest.mock('@/app/components', () => ({
	...jest.requireActual('@/app/components'),
	FaIcon: ({ iconName }: { iconName: string }) => (
		<span data-testid="fa-icon" data-icon={iconName} />
	),
}));

const mockApplyTextScale = jest.fn();
const mockApplySpacing = jest.fn();
const mockReadStoredScale = jest.fn().mockReturnValue(100);
const mockReadStoredLevel = jest.fn().mockReturnValue(0);

jest.mock('@/app/layout/accessibility-widget/accessibility-widget.helpers', () => ({
	applyTextScale: (...args: unknown[]) => mockApplyTextScale(...args),
	applySpacing: (...args: unknown[]) => mockApplySpacing(...args),
	readStoredScale: () => mockReadStoredScale(),
	readStoredLevel: () => mockReadStoredLevel(),
	incrementSpacingLevel: (level: number) => Math.min(level + 1, 3),
	decrementSpacingLevel: (level: number) => Math.max(level - 1, 0),
	formatSpacingValue: (values: ReadonlyArray<'Normal' | number>, level: number, suffix: string) => {
		const value = values[level];
		if (value === 'Normal') return 'Normal';
		return `${value}${suffix}`;
	},
}));

import { AccessibilitySection } from '../accessibility-section.component';

beforeEach(() => {
	jest.clearAllMocks();
	mockReadStoredScale.mockReturnValue(100);
	mockReadStoredLevel.mockReturnValue(0);
});

describe('AccessibilitySection', () => {
	it('renders text size controls with default value', () => {
		render(<AccessibilitySection />);
		expect(screen.getByText('100%')).toBeInTheDocument();
		expect(screen.getByText('Text size')).toBeInTheDocument();
	});

	it('renders line height controls', () => {
		render(<AccessibilitySection />);
		expect(screen.getByText('Line height')).toBeInTheDocument();
	});

	it('renders letter spacing controls', () => {
		render(<AccessibilitySection />);
		expect(screen.getByText('Letter spacing')).toBeInTheDocument();
	});

	it('increases text size when increase button is clicked', () => {
		render(<AccessibilitySection />);
		fireEvent.click(screen.getByLabelText('Increase text size'));
		expect(screen.getByText('125%')).toBeInTheDocument();
	});

	it('decreases text size when decrease button is clicked', () => {
		mockReadStoredScale.mockReturnValue(150);
		render(<AccessibilitySection />);
		fireEvent.click(screen.getByLabelText('Decrease text size'));
		expect(screen.getByText('125%')).toBeInTheDocument();
	});

	it('disables decrease text size button at minimum', () => {
		render(<AccessibilitySection />);
		expect(screen.getByLabelText('Decrease text size')).toBeDisabled();
	});

	it('disables increase text size button at maximum', () => {
		mockReadStoredScale.mockReturnValue(200);
		render(<AccessibilitySection />);
		expect(screen.getByLabelText('Increase text size')).toBeDisabled();
	});

	it('increases line height when increase button is clicked', () => {
		render(<AccessibilitySection />);
		fireEvent.click(screen.getByLabelText('Increase line height'));
		expect(screen.getByText('1.5')).toBeInTheDocument();
	});

	it('increases letter spacing when increase button is clicked', () => {
		render(<AccessibilitySection />);
		fireEvent.click(screen.getByLabelText('Increase letter spacing'));
		expect(screen.getByText('0.05em')).toBeInTheDocument();
	});

	it('resets text size when reset button is clicked', () => {
		mockReadStoredScale.mockReturnValue(150);
		render(<AccessibilitySection />);
		fireEvent.click(screen.getByLabelText('Reset text size'));
		expect(screen.getByText('100%')).toBeInTheDocument();
	});

	it('resets line height when reset button is clicked', () => {
		mockReadStoredLevel.mockReturnValue(2);
		render(<AccessibilitySection />);
		fireEvent.click(screen.getByLabelText('Reset line height'));
		expect(mockApplySpacing).toHaveBeenCalled();
	});

	it('resets letter spacing when reset button is clicked', () => {
		mockReadStoredLevel.mockReturnValue(2);
		render(<AccessibilitySection />);
		fireEvent.click(screen.getByLabelText('Reset letter spacing'));
		expect(mockApplySpacing).toHaveBeenCalled();
	});

	it('resets all settings when reset all button is clicked', () => {
		mockReadStoredScale.mockReturnValue(150);
		mockReadStoredLevel.mockReturnValue(2);
		render(<AccessibilitySection />);
		fireEvent.click(screen.getByLabelText('Reset all'));
		expect(screen.getByText('100%')).toBeInTheDocument();
	});

	it('disables reset all button when all values are default', () => {
		render(<AccessibilitySection />);
		expect(screen.getByLabelText('Reset all')).toBeDisabled();
	});

	it('disables reset text size button when at default', () => {
		render(<AccessibilitySection />);
		expect(screen.getByLabelText('Reset text size')).toBeDisabled();
	});

	it('calls applyTextScale on text scale change', () => {
		render(<AccessibilitySection />);
		fireEvent.click(screen.getByLabelText('Increase text size'));
		expect(mockApplyTextScale).toHaveBeenCalledWith(125);
	});

	it('calls applySpacing on line height change', () => {
		render(<AccessibilitySection />);
		fireEvent.click(screen.getByLabelText('Increase line height'));
		expect(mockApplySpacing).toHaveBeenCalled();
	});

	it('disables decrease line height at minimum', () => {
		render(<AccessibilitySection />);
		expect(screen.getByLabelText('Decrease line height')).toBeDisabled();
	});

	it('disables decrease letter spacing at minimum', () => {
		render(<AccessibilitySection />);
		expect(screen.getByLabelText('Decrease letter spacing')).toBeDisabled();
	});

	it('enables reset all when text scale is not default', () => {
		mockReadStoredScale.mockReturnValue(150);
		render(<AccessibilitySection />);
		expect(screen.getByLabelText('Reset all')).not.toBeDisabled();
	});

	it('enables reset text size when not at default', () => {
		mockReadStoredScale.mockReturnValue(150);
		render(<AccessibilitySection />);
		expect(screen.getByLabelText('Reset text size')).not.toBeDisabled();
	});
});
