import { fireEvent, render, screen } from '@testing-library/react';
import { BlogTagFilter } from '../blog-tag-filter.component';

const TAGS: Technology[] = ['react', 'typescript', 'css'];

describe('BlogTagFilter', () => {
	it('renders a button for each tag', () => {
		render(<BlogTagFilter tags={TAGS} selected={[]} onToggleAction={jest.fn()} />);
		expect(screen.getByRole('button', { name: 'react' })).toBeInTheDocument();
		expect(screen.getByRole('button', { name: 'typescript' })).toBeInTheDocument();
		expect(screen.getByRole('button', { name: 'css' })).toBeInTheDocument();
	});

	it('renders the label', () => {
		render(<BlogTagFilter tags={TAGS} selected={[]} onToggleAction={jest.fn()} />);
		expect(screen.getByText('_tags:')).toBeInTheDocument();
	});

	it('marks selected tags as pressed', () => {
		render(<BlogTagFilter tags={TAGS} selected={['react']} onToggleAction={jest.fn()} />);
		expect(screen.getByRole('button', { name: 'react' })).toHaveAttribute('aria-pressed', 'true');
		expect(screen.getByRole('button', { name: 'typescript' })).toHaveAttribute('aria-pressed', 'false');
	});

	it('calls onToggleAction when a tag is clicked', () => {
		const onToggle = jest.fn();
		render(<BlogTagFilter tags={TAGS} selected={[]} onToggleAction={onToggle} />);
		fireEvent.click(screen.getByRole('button', { name: 'typescript' }));
		expect(onToggle).toHaveBeenCalledWith('typescript');
	});

	it('has a group role with accessible label', () => {
		render(<BlogTagFilter tags={TAGS} selected={[]} onToggleAction={jest.fn()} />);
		expect(screen.getByRole('group', { name: 'Filter by tags' })).toBeInTheDocument();
	});

	it('renders with no tags without errors', () => {
		render(<BlogTagFilter tags={[]} selected={[]} onToggleAction={jest.fn()} />);
		expect(screen.getByRole('group')).toBeInTheDocument();
		expect(screen.queryAllByRole('button')).toHaveLength(0);
	});
});
