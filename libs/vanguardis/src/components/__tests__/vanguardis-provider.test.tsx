import { render, screen } from '@testing-library/react';
import { VanguardisProvider } from '../vanguardis-provider';

describe('VanguardisProvider', () => {
	it('should render children correctly', () => {
		const testContent = 'Test Content';

		render(
			<VanguardisProvider>
				<div>{testContent}</div>
			</VanguardisProvider>,
		);

		expect(screen.getByText(testContent)).toBeInTheDocument();
	});

	it('should apply default class and data attribute', () => {
		const testContent = 'Test Content';

		render(
			<VanguardisProvider>
				<div>{testContent}</div>
			</VanguardisProvider>,
		);

		const provider = screen.getByText(testContent).parentElement;
		expect(provider).toHaveClass('vanguardis-provider');
		expect(provider).toHaveAttribute('data-vanguardis-provider');
	});

	it('should apply custom className when provided', () => {
		const customClass = 'custom-class';
		const testContent = 'Test Content';

		render(
			<VanguardisProvider className={customClass}>
				<div>{testContent}</div>
			</VanguardisProvider>,
		);

		const provider = screen.getByText(testContent).parentElement;
		expect(provider).toHaveClass('vanguardis-provider', customClass);
	});

	it('should work with empty className', () => {
		const testContent = 'Test Content';

		render(
			<VanguardisProvider className="">
				<div>{testContent}</div>
			</VanguardisProvider>,
		);

		const provider = screen.getByText(testContent).parentElement;
		expect(provider).toHaveClass('vanguardis-provider');
		expect(provider?.className.trim()).toBe('vanguardis-provider');
	});

	it('should work with multiple children', () => {
		render(
			<VanguardisProvider>
				<div>Child 1</div>
				<div>Child 2</div>
				<span>Child 3</span>
			</VanguardisProvider>,
		);

		expect(screen.getByText('Child 1')).toBeInTheDocument();
		expect(screen.getByText('Child 2')).toBeInTheDocument();
		expect(screen.getByText('Child 3')).toBeInTheDocument();
	});

	it('should maintain provider structure with nested components', () => {
		render(
			<VanguardisProvider className="outer-provider">
				<VanguardisProvider className="inner-provider">
					<div>Nested Content</div>
				</VanguardisProvider>
			</VanguardisProvider>,
		);

		const content = screen.getByText('Nested Content');
		const innerProvider = content.parentElement;
		const outerProvider = innerProvider?.parentElement;

		expect(innerProvider).toHaveClass('vanguardis-provider', 'inner-provider');
		expect(outerProvider).toHaveClass('vanguardis-provider', 'outer-provider');
	});
});
