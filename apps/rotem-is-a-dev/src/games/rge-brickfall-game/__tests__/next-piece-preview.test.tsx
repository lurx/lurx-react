import { render, screen } from '@testing-library/react';
import { NextPiecePreview } from '../components/next-piece-preview';

describe('NextPiecePreview', () => {
	it('renders a preview container', () => {
		render(<NextPiecePreview type="T" />);
		expect(screen.getByTestId('next-piece-preview')).toBeInTheDocument();
	});

	it('renders 4 preview cells', () => {
		render(<NextPiecePreview type="T" />);
		const cells = screen.getAllByTestId('preview-cell');
		expect(cells).toHaveLength(4);
	});

	it('uses the correct color for each piece type', () => {
		render(<NextPiecePreview type="I" />);
		const cell = screen.getAllByTestId('preview-cell')[0];
		expect(cell.style.backgroundColor).toBe('rgb(0, 229, 255)');
	});

	it('renders O piece cells', () => {
		render(<NextPiecePreview type="O" />);
		const cells = screen.getAllByTestId('preview-cell');
		expect(cells).toHaveLength(4);
	});
});
