import { render, screen } from '@testing-library/react';
import { FileTree } from '../file-tree.component';

describe('FileTree', () => {
	it('renders the personal-info section header', () => {
		render(<FileTree />);
		expect(screen.getByText('personal-info')).toBeInTheDocument();
	});

	// it('renders the contacts section header', () => {
	// 	render(<FileTree />);
	// 	expect(screen.getByText('contacts')).toBeInTheDocument();
	// });

	it('renders the bio file item', () => {
		render(<FileTree />);
		expect(screen.getByText('bio')).toBeInTheDocument();
	});

	it('renders the interests file item', () => {
		render(<FileTree />);
		expect(screen.getByText('interests')).toBeInTheDocument();
	});

	it('renders the education folder', () => {
		render(<FileTree />);
		expect(screen.getByText('education')).toBeInTheDocument();
	});

	it('renders the high-school nested file item', () => {
		render(<FileTree />);
		expect(screen.getByText('high-school')).toBeInTheDocument();
	});

	it('renders the university nested file item', () => {
		render(<FileTree />);
		expect(screen.getByText('university')).toBeInTheDocument();
	});

	// it('renders the email contact', () => {
	// 	render(<FileTree />);
	// 	expect(screen.getByText('rotemhorovitz@gmail.com')).toBeInTheDocument();
	// });

	// it('renders the phone contact', () => {
	// 	render(<FileTree />);
	// 	expect(screen.getByText('+972526430444')).toBeInTheDocument();
	// });
});
