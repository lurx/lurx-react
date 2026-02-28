import { render } from '@testing-library/react';

jest.mock('gsap', () => {
	const timelineInstance = {
		from: jest.fn().mockReturnThis(),
		to: jest.fn().mockReturnThis(),
		add: jest.fn().mockReturnThis(),
		call: jest.fn().mockReturnThis(),
		kill: jest.fn(),
	};
	return {
		__esModule: true,
		default: {
			timeline: jest.fn(() => timelineInstance),
			set: jest.fn(),
			utils: {
				toArray: jest.fn(() => []),
			},
		},
	};
});

jest.mock('@/app/utils/typewrite.util', () => ({
	typewrite: jest.fn(() => ({})),
}));

let mockIsShellLoaded = false;
let mockAnimationKey = 0;
const mockSetIsShellLoaded = jest.fn();

jest.mock('../entry-animation.context', () => ({
	SESSION_KEY: 'entry-animation-played',
	useEntryAnimation: () => ({
		setIsShellLoaded: mockSetIsShellLoaded,
		animationKey: mockAnimationKey,
		isShellLoaded: mockIsShellLoaded,
		triggerReplay: jest.fn(),
	}),
}));

import { EntryAnimation } from '../entry-animation.component';
import gsap from 'gsap';

const mockGsap = gsap as jest.Mocked<typeof gsap>;

beforeEach(() => {
	mockSetIsShellLoaded.mockClear();
	jest.clearAllMocks();
	mockIsShellLoaded = false;
	mockAnimationKey = 0;
	sessionStorage.clear();
	Object.defineProperty(window, 'matchMedia', {
		writable: true,
		value: jest.fn().mockReturnValue({ matches: false }),
	});
});

describe('EntryAnimation', () => {
	it('renders null (no DOM output)', () => {
		const { container } = render(<EntryAnimation />);
		expect(container).toBeEmptyDOMElement();
	});

	it('skips animation and calls setIsShellLoaded(true) when reduced motion is preferred', () => {
		Object.defineProperty(window, 'matchMedia', {
			writable: true,
			value: jest.fn().mockReturnValue({ matches: true }),
		});
		render(<EntryAnimation />);
		expect(mockSetIsShellLoaded).toHaveBeenCalledWith(true);
		expect(mockGsap.timeline).not.toHaveBeenCalled();
	});

	it('skips animation and calls setIsShellLoaded(true) when session key is set', () => {
		sessionStorage.setItem('entry-animation-played', 'true');
		render(<EntryAnimation />);
		expect(mockSetIsShellLoaded).toHaveBeenCalledWith(true);
		expect(mockGsap.timeline).not.toHaveBeenCalled();
	});

	it('skips animation and calls setIsShellLoaded(true) when data-page element is absent', () => {
		render(<EntryAnimation />);
		expect(mockSetIsShellLoaded).toHaveBeenCalledWith(true);
	});

	it('builds a GSAP timeline when data-page element exists and animation should run', () => {
		const pageEl = document.createElement('div');
		pageEl.setAttribute('data-page', '');
		document.body.appendChild(pageEl);

		render(<EntryAnimation />);
		expect(mockGsap.timeline).toHaveBeenCalled();

		document.body.removeChild(pageEl);
	});

	it('adds typewrite tweens for navbar and footer text elements', () => {
		const pageEl = document.createElement('div');
		pageEl.setAttribute('data-page', '');
		document.body.appendChild(pageEl);

		const navEl = document.createElement('span');
		navEl.textContent = 'nav';
		const footerEl = document.createElement('span');
		footerEl.textContent = 'footer';

		const toArrayMock = mockGsap.utils.toArray as jest.Mock;
		toArrayMock
			.mockReturnValueOnce([navEl])
			.mockReturnValueOnce([footerEl]);

		render(<EntryAnimation />);

		const { typewrite } = jest.requireMock('@/app/utils/typewrite.util');
		expect(typewrite).toHaveBeenCalledWith(navEl, { setDataFullText: true });
		expect(typewrite).toHaveBeenCalledWith(footerEl, { setDataFullText: true });

		document.body.removeChild(pageEl);
	});

	it('restores saved text content on unmount', () => {
		const pageEl = document.createElement('div');
		pageEl.setAttribute('data-page', '');
		document.body.appendChild(pageEl);

		const navEl = document.createElement('span');
		navEl.textContent = 'logo';
		const footerEl = document.createElement('span');
		footerEl.textContent = 'built by';

		const toArrayMock = mockGsap.utils.toArray as jest.Mock;
		toArrayMock
			.mockReturnValueOnce([navEl])
			.mockReturnValueOnce([footerEl]);

		const { unmount } = render(<EntryAnimation />);
		// Clear text to simulate animation modifying it
		navEl.textContent = '';
		footerEl.textContent = '';

		unmount();
		expect(navEl.textContent).toBe('logo');
		expect(footerEl.textContent).toBe('built by');
		expect(navEl.style.minWidth).toBe('');
		expect(navEl.style.minHeight).toBe('');

		document.body.removeChild(pageEl);
	});

	it('kills the timeline on unmount', () => {
		const pageEl = document.createElement('div');
		pageEl.setAttribute('data-page', '');
		document.body.appendChild(pageEl);

		const tl = mockGsap.timeline();
		const { unmount } = render(<EntryAnimation />);
		unmount();
		expect(tl.kill).toHaveBeenCalled();

		document.body.removeChild(pageEl);
	});

	it('cleans up GSAP border props on unmount', () => {
		const pageEl = document.createElement('div');
		pageEl.setAttribute('data-page', '');
		document.body.appendChild(pageEl);

		const { unmount } = render(<EntryAnimation />);
		unmount();
		expect(mockGsap.set).toHaveBeenCalledWith(
			'[data-border-h]',
			{ clearProps: 'all' },
		);

		document.body.removeChild(pageEl);
	});

	it('cleans up GSAP icon props on unmount', () => {
		const pageEl = document.createElement('div');
		pageEl.setAttribute('data-page', '');
		document.body.appendChild(pageEl);

		const { unmount } = render(<EntryAnimation />);
		unmount();
		expect(mockGsap.set).toHaveBeenCalledWith(
			'[data-animate-icon]',
			{ clearProps: 'all' },
		);

		document.body.removeChild(pageEl);
	});
});
