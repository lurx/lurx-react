import { render, screen } from '@testing-library/react';
import { AppProvider, useAppContext } from '../app-context';

// Mock the environment utility
jest.mock('@/utils/env', () => ({
	IS_UNDER_CONSTRUCTION: false,
}));

// Test component to consume the context
function TestComponent() {
	const { isUnderConstruction } = useAppContext();
	return <div data-testid="test-component">{isUnderConstruction ? 'Under Construction' : 'Live'}</div>;
}

describe('AppContext', () => {
	describe('AppProvider', () => {
		it('should provide context value to children', () => {
			render(
				<AppProvider>
					<TestComponent />
				</AppProvider>
			);

			expect(screen.getByTestId('test-component')).toHaveTextContent('Live');
		});

		it('should render children correctly', () => {
			const childText = 'Test Child Content';
			render(
				<AppProvider>
					<div data-testid="child">{childText}</div>
				</AppProvider>
			);

			expect(screen.getByTestId('child')).toHaveTextContent(childText);
		});
	});

	describe('useAppContext', () => {
		it('should throw error when used outside AppProvider', () => {
			// Suppress console.error for this test
			const originalError = console.error;
			console.error = jest.fn();

			expect(() => {
				render(<TestComponent />);
			}).toThrow('useAppContext must be used within an <AppProvider>');

			console.error = originalError;
		});

		it('should return context value when used within AppProvider', () => {
			render(
				<AppProvider>
					<TestComponent />
				</AppProvider>
			);

			// The component should render without throwing an error
			expect(screen.getByTestId('test-component')).toBeInTheDocument();
		});
	});

	describe('Context Value', () => {
		it('should provide isUnderConstruction from environment', () => {
			render(
				<AppProvider>
					<TestComponent />
				</AppProvider>
			);

			// Since we mocked IS_UNDER_CONSTRUCTION as false, it should show 'Live'
			expect(screen.getByTestId('test-component')).toHaveTextContent('Live');
		});
	});
});
