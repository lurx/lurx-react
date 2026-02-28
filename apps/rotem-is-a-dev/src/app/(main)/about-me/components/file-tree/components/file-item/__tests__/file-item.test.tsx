import { fireEvent, render, screen } from '@testing-library/react';
import { FileItem } from '../file-item.component';

jest.mock('@/app/components', () => ({
	FaIcon: ({ iconName }: { iconName: string }) => (
		<span data-testid="icon">{iconName}</span>
	),
}));

describe('FileItem', () => {
	it('renders the label text', () => {
		render(<FileItem label="bio" />);
		expect(screen.getByText('bio')).toBeInTheDocument();
	});

	it('renders as a button', () => {
		render(<FileItem label="interests" />);
		expect(screen.getByRole('button')).toBeInTheDocument();
	});

	it('renders a file-lines icon', () => {
		render(<FileItem label="bio" />);
		expect(screen.getByTestId('icon')).toHaveTextContent('file-lines');
	});

	it('calls onClick when the button is clicked', () => {
		const onClick = jest.fn();
		render(<FileItem label="bio" onClick={onClick} />);
		fireEvent.click(screen.getByRole('button'));
		expect(onClick).toHaveBeenCalledTimes(1);
	});

	it('applies active styles when active is true', () => {
		render(<FileItem label="bio" active={true} />);
		expect(screen.getByRole('button').className).toContain('activeFile');
	});

	it('does not apply active styles when active is false', () => {
		render(<FileItem label="bio" active={false} />);
		expect(screen.getByRole('button').className).not.toContain('activeFile');
	});

	it('does not apply active styles when active is omitted', () => {
		render(<FileItem label="bio" />);
		expect(screen.getByRole('button').className).not.toContain('activeFile');
	});

	it('does not throw when onClick is omitted', () => {
		render(<FileItem label="bio" />);
		expect(() => fireEvent.click(screen.getByRole('button'))).not.toThrow();
	});
});
