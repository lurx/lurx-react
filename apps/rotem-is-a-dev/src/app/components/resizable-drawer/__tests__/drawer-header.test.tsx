import { fireEvent, render, screen } from '@testing-library/react';
import { DrawerHeader } from '../drawer-header.component';

jest.mock('../../fa-icon/fa-icon.component', () => ({
	FaIcon: ({ iconName }: { iconName: string }) => (
		<span data-testid="icon">{iconName}</span>
	),
}));

describe('DrawerHeader', () => {
	it('renders the close button', () => {
		render(<DrawerHeader onCloseAction={jest.fn()} />);
		expect(screen.getByLabelText('Close drawer')).toBeInTheDocument();
	});

	it('renders the close button with correct data-testid', () => {
		render(<DrawerHeader onCloseAction={jest.fn()} />);
		expect(screen.getByTestId('resizable-drawer-close')).toBeInTheDocument();
	});

	it('calls onCloseAction when close button is clicked', () => {
		const onClose = jest.fn();
		render(<DrawerHeader onCloseAction={onClose} />);
		fireEvent.click(screen.getByLabelText('Close drawer'));
		expect(onClose).toHaveBeenCalledTimes(1);
	});

	it('renders an xmark icon inside the close button', () => {
		render(<DrawerHeader onCloseAction={jest.fn()} />);
		expect(screen.getByTestId('icon')).toHaveTextContent('xmark');
	});

	it('renders a string title when provided', () => {
		render(<DrawerHeader onCloseAction={jest.fn()} title="My Drawer" />);
		expect(screen.getByText('My Drawer')).toBeInTheDocument();
	});

	it('renders a JSX title when provided', () => {
		render(
			<DrawerHeader
				onCloseAction={jest.fn()}
				title={<span data-testid="title-node">Custom Title</span>}
			/>,
		);
		expect(screen.getByTestId('title-node')).toBeInTheDocument();
	});

	it('does not render a title container when title is not provided', () => {
		const { container } = render(<DrawerHeader onCloseAction={jest.fn()} />);
		const titleEl = container.querySelector('[class*="title"]');
		expect(titleEl).not.toBeInTheDocument();
	});

	it('has type="button" on the close button', () => {
		render(<DrawerHeader onCloseAction={jest.fn()} />);
		expect(screen.getByLabelText('Close drawer')).toHaveAttribute('type', 'button');
	});

	it('calls onCloseAction multiple times when clicked multiple times', () => {
		const onClose = jest.fn();
		render(<DrawerHeader onCloseAction={onClose} />);
		fireEvent.click(screen.getByLabelText('Close drawer'));
		fireEvent.click(screen.getByLabelText('Close drawer'));
		expect(onClose).toHaveBeenCalledTimes(2);
	});
});
