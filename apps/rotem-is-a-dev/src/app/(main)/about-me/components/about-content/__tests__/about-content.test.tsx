import { render, screen } from '@testing-library/react';
import { AboutContent } from '../about-content.component';
import type { AboutFileId } from '../../../data/about-files.data';

jest.mock('@/app/components', () => ({
	FaIcon: ({ iconName }: { iconName: string }) => (
		<span data-testid="icon">{iconName}</span>
	),
}));

jest.mock('@/hooks', () => ({
	useResponsive: jest.fn(() => ({ isMobile: false, isTablet: false, isDesktop: true })),
}));

jest.mock('../../gist-panel', () => ({
	GistPanel: () => <div data-testid="gist-panel">Gist Panel</div>,
}));

jest.mock('../../gaming-panel', () => ({
	GamingPanel: () => <div data-testid="gaming-panel">Gaming Panel</div>,
}));

let portalRoot: HTMLDivElement;

beforeEach(() => {
	portalRoot = document.createElement('div');
	portalRoot.id = 'portal-root';
	document.body.appendChild(portalRoot);
});

afterEach(() => {
	portalRoot.remove();
});

const defaultProps = {
	openTabs: ['bio'] as AboutFileId[],
	activeFileId: 'bio' as Nullable<AboutFileId>,
	activeSection: 'personal-info' as Nullable<'personal-info' | 'work-experience' | 'gaming'>,
	onTabSelect: jest.fn(),
	onTabClose: jest.fn(),
	onCloseOthers: jest.fn(),
	onCloseAll: jest.fn(),
};

describe('AboutContent', () => {
	it('renders children', () => {
		render(
			<AboutContent {...defaultProps}>
				<p>Panel content</p>
			</AboutContent>,
		);
		expect(screen.getByText('Panel content')).toBeInTheDocument();
	});

	it('renders the TabBar with the active tab', () => {
		render(<AboutContent {...defaultProps} />);
		expect(screen.getByRole('tab', { selected: true })).toHaveTextContent('bio');
	});

	it('renders multiple open tabs', () => {
		render(
			<AboutContent
				{...defaultProps}
				openTabs={['bio', 'interests'] as AboutFileId[]}
			/>,
		);
		const tabs = screen.getAllByRole('tab');
		expect(tabs).toHaveLength(2);
	});

	it('renders the tab close button', () => {
		render(<AboutContent {...defaultProps} />);
		expect(screen.getByLabelText('Close bio tab')).toBeInTheDocument();
	});

	it('renders no tabs when openTabs is empty', () => {
		render(
			<AboutContent
				{...defaultProps}
				openTabs={[]}
				activeFileId={null}
				activeSection={null}
			/>,
		);
		expect(screen.queryAllByRole('tab')).toHaveLength(0);
	});

	it('renders GamingPanel when activeSection is gaming', () => {
		render(
			<AboutContent
				{...defaultProps}
				activeFileId={'snake-game' as AboutFileId}
				activeSection="gaming"
			>
				<p>Editor content</p>
			</AboutContent>,
		);
		expect(screen.getByTestId('gaming-panel')).toBeInTheDocument();
		expect(screen.queryByTestId('gist-panel')).not.toBeInTheDocument();
	});

	it('renders GistPanel for non-gaming sections', () => {
		render(
			<AboutContent {...defaultProps}>
				<p>Editor content</p>
			</AboutContent>,
		);
		expect(screen.getByTestId('gist-panel')).toBeInTheDocument();
		expect(screen.queryByTestId('gaming-panel')).not.toBeInTheDocument();
	});

	it('renders children alongside the tab bar', () => {
		render(
			<AboutContent {...defaultProps}>
				<div data-testid="panel">my panel</div>
			</AboutContent>,
		);
		expect(screen.getByTestId('panel')).toBeInTheDocument();
		expect(screen.getByRole('tab')).toBeInTheDocument();
	});
});
