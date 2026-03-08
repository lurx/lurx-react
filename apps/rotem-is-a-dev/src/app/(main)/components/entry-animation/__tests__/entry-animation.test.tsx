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
	Object.defineProperty(globalThis, 'matchMedia', {
		writable: true,
		value: jest.fn().mockReturnValue({ matches: false }),
	});
});

const createPageElement = () => {
	const el = document.createElement('div');
	el.dataset.page = '';
	document.body.appendChild(el);
	return el;
};

describe('EntryAnimation', () => {
	it('renders null (no DOM output)', () => {
		const { container } = render(<EntryAnimation />);
		expect(container).toBeEmptyDOMElement();
	});

	it('skips animation and calls setIsShellLoaded(true) when reduced motion is preferred', () => {
		Object.defineProperty(globalThis, 'matchMedia', {
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
		const pageEl = createPageElement();

		render(<EntryAnimation />);
		expect(mockGsap.timeline).toHaveBeenCalled();

		pageEl.remove();
	});

	it('adds typewrite tweens for navbar and footer text elements', () => {
		const pageEl = createPageElement();

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

		pageEl.remove();
	});

	it('restores saved text content on unmount', () => {
		const pageEl = createPageElement();

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

		pageEl.remove();
	});

	it('kills the timeline on unmount', () => {
		const pageEl = createPageElement();

		const tl = mockGsap.timeline();
		const { unmount } = render(<EntryAnimation />);
		unmount();
		expect(tl.kill).toHaveBeenCalled();

		pageEl.remove();
	});

	it('cleans up GSAP border props on unmount', () => {
		const pageEl = createPageElement();

		const { unmount } = render(<EntryAnimation />);
		unmount();
		expect(mockGsap.set).toHaveBeenCalledWith(
			'[data-border-h]',
			{ clearProps: 'all' },
		);

		pageEl.remove();
	});

	it('cleans up GSAP icon props on unmount', () => {
		const pageEl = createPageElement();

		const { unmount } = render(<EntryAnimation />);
		unmount();
		expect(mockGsap.set).toHaveBeenCalledWith(
			'[data-animate-icon]',
			{ clearProps: 'all' },
		);

		pageEl.remove();
	});

	it('uses staggered positions for subsequent navbar elements', () => {
		const pageEl = createPageElement();

		const nav1 = document.createElement('span');
		nav1.textContent = 'logo';
		const nav2 = document.createElement('span');
		nav2.textContent = 'about';

		const toArrayMock = mockGsap.utils.toArray as jest.Mock;
		toArrayMock
			.mockReturnValueOnce([nav1, nav2])
			.mockReturnValueOnce([]);

		render(<EntryAnimation />);

		const tl = mockGsap.timeline();
		const addCalls = (tl.add as jest.Mock).mock.calls;
		expect(addCalls[0][1]).toBe(0);
		expect(addCalls[1][1]).toBe('<+=0.15');

		pageEl.remove();
	});

	it('uses staggered positions for subsequent footer elements', () => {
		const pageEl = createPageElement();

		const footer1 = document.createElement('span');
		footer1.textContent = 'built by';
		const footer2 = document.createElement('span');
		footer2.textContent = 'lurx';

		const toArrayMock = mockGsap.utils.toArray as jest.Mock;
		toArrayMock
			.mockReturnValueOnce([])
			.mockReturnValueOnce([footer1, footer2]);

		render(<EntryAnimation />);

		const tl = mockGsap.timeline();
		const addCalls = (tl.add as jest.Mock).mock.calls;
		expect(addCalls[0][1]).toBe('>');
		expect(addCalls[1][1]).toBe('<+=0.15');

		pageEl.remove();
	});

	it('invokes setIsShellLoaded(true) via the tl.call callback', () => {
		const pageEl = createPageElement();

		render(<EntryAnimation />);

		const tl = mockGsap.timeline();
		const callbackFn = (tl.call as jest.Mock).mock.calls[0][0];
		callbackFn();
		expect(mockSetIsShellLoaded).toHaveBeenCalledWith(true);

		pageEl.remove();
	});

	it('falls back to empty string when element textContent is null', () => {
		const pageEl = createPageElement();

		const el = document.createElement('span');
		Object.defineProperty(el, 'textContent', { value: null, writable: true, configurable: true });

		const toArrayMock = mockGsap.utils.toArray as jest.Mock;
		toArrayMock
			.mockReturnValueOnce([el])
			.mockReturnValueOnce([]);

		const { unmount } = render(<EntryAnimation />);
		unmount();

		expect(el.textContent).toBe('');

		pageEl.remove();
	});
});
