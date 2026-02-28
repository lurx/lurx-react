import { render, screen } from '@testing-library/react';
import { MobileNavItem } from '../mobile-nav-item.component';

describe('MobileNavItem', () => {
	it('renders a list item', () => {
		render(
			<ul>
				<MobileNavItem label="hello" href="/" pathname="/" />
			</ul>,
		);
		expect(screen.getByRole('listitem')).toBeInTheDocument();
	});

	it('renders a link with the correct href', () => {
		render(
			<ul>
				<MobileNavItem label="hello" href="/" pathname="/about" />
			</ul>,
		);
		expect(screen.getByRole('menuitem')).toHaveAttribute('href', '/');
	});

	it('converts label to code-like format with _ prefix and kebab-case', () => {
		render(
			<ul>
				<MobileNavItem label="about me" href="/about-me" pathname="/" />
			</ul>,
		);
		expect(screen.getByText('_about-me')).toBeInTheDocument();
	});

	it('converts single-word label with _ prefix', () => {
		render(
			<ul>
				<MobileNavItem label="hello" href="/" pathname="/" />
			</ul>,
		);
		expect(screen.getByText('_hello')).toBeInTheDocument();
	});

	it('sets aria-current="page" when href matches pathname', () => {
		render(
			<ul>
				<MobileNavItem label="hello" href="/" pathname="/" />
			</ul>,
		);
		expect(screen.getByRole('menuitem')).toHaveAttribute('aria-current', 'page');
	});

	it('does not set aria-current when href does not match pathname', () => {
		render(
			<ul>
				<MobileNavItem label="about me" href="/about-me" pathname="/" />
			</ul>,
		);
		expect(screen.getByRole('menuitem')).not.toHaveAttribute('aria-current');
	});

	it('renders with role="menuitem"', () => {
		render(
			<ul>
				<MobileNavItem label="projects" href="/projects" pathname="/" />
			</ul>,
		);
		expect(screen.getByRole('menuitem')).toBeInTheDocument();
	});

	it('applies active class when href matches pathname', () => {
		render(
			<ul>
				<MobileNavItem label="hello" href="/" pathname="/" />
			</ul>,
		);
		expect(screen.getByRole('menuitem').className).toContain('active');
	});

	it('does not apply active class when href does not match pathname', () => {
		render(
			<ul>
				<MobileNavItem label="about me" href="/about-me" pathname="/" />
			</ul>,
		);
		expect(screen.getByRole('menuitem').className).not.toContain('active');
	});
});
