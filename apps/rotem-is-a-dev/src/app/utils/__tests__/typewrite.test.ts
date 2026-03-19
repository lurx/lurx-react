import gsap from 'gsap';
import { typewrite } from '../typewrite.util';

jest.mock('gsap', () => ({
	default: { to: jest.fn(() => ({ kill: jest.fn() })) },
	__esModule: true,
}));

const mockGsapTo = gsap.to as jest.Mock;

function makeElement(text: string, width = 200, height = 50): HTMLElement {
	const el = document.createElement('span');
	el.textContent = text;
	jest.spyOn(el, 'getBoundingClientRect').mockReturnValue({
		width,
		height,
		top: 0,
		left: 0,
		right: width,
		bottom: height,
		x: 0,
		y: 0,
		toJSON: () => ({}),
	});
	return el;
}

describe('typewrite', () => {
	beforeEach(() => {
		mockGsapTo.mockClear();
	});

	it('locks the element dimensions before animating', () => {
		const el = makeElement('hello', 120, 40);
		typewrite(el);
		expect(el.style.minWidth).toBe('120px');
		expect(el.style.minHeight).toBe('40px');
	});

	it('clears the text content before starting the tween', () => {
		const el = makeElement('hello');
		typewrite(el);
		expect(el.textContent).toBe('');
	});

	it('calls gsap.to with count equal to the full text length', () => {
		const el = makeElement('hello');
		typewrite(el);
		const [, tweenVars] = mockGsapTo.mock.calls[0];
		expect(tweenVars.count).toBe(5);
	});

	it('uses baseDuration when text is too short to exceed it', () => {
		const el = makeElement('hi');
		typewrite(el, { baseDuration: 0.4, charSpeed: 0.055 });
		const [, tweenVars] = mockGsapTo.mock.calls[0];
		// 2 * 0.055 = 0.11, which is less than baseDuration 0.4
		expect(tweenVars.duration).toBe(0.4);
	});

	it('uses charSpeed duration when text is long enough to exceed baseDuration', () => {
		const el = makeElement('a'.repeat(20));
		typewrite(el, { baseDuration: 0.4, charSpeed: 0.055 });
		const [, tweenVars] = mockGsapTo.mock.calls[0];
		// 20 * 0.055 = 1.1, which exceeds baseDuration 0.4
		expect(tweenVars.duration).toBeCloseTo(1.1);
	});

	it('sets data-full-text attribute when setDataFullText is true', () => {
		const el = makeElement('hello world');
		typewrite(el, { setDataFullText: true });
		expect(el.dataset.fullText).toBe('hello world');
	});

	it('does not set data-full-text attribute when setDataFullText is false', () => {
		const el = makeElement('hello world');
		typewrite(el, { setDataFullText: false });
		expect(el.dataset.fullText).toBeUndefined();
	});

	it('does not set data-full-text attribute by default', () => {
		const el = makeElement('hello');
		typewrite(el);
		expect(el.dataset.fullText).toBeUndefined();
	});

	it('handles an element with empty text content', () => {
		const el = makeElement('');
		typewrite(el);
		const [, tweenVars] = mockGsapTo.mock.calls[0];
		expect(tweenVars.count).toBe(0);
		expect(tweenVars.duration).toBe(0.4);
	});

	it('defaults to empty string when textContent is null', () => {
		const el = makeElement('');
		Object.defineProperty(el, 'textContent', {
			get: jest.fn().mockReturnValueOnce(null).mockReturnValue(''),
			set: jest.fn(),
			configurable: true,
		});
		typewrite(el);
		const [, tweenVars] = mockGsapTo.mock.calls[0];
		expect(tweenVars.count).toBe(0);
	});

	it('uses ease none', () => {
		const el = makeElement('test');
		typewrite(el);
		const [, tweenVars] = mockGsapTo.mock.calls[0];
		expect(tweenVars.ease).toBe('none');
	});

	describe('onUpdate callback', () => {
		it('slices text content to the rounded count value', () => {
			const el = makeElement('hello');
			typewrite(el);
			const [obj, tweenVars] = mockGsapTo.mock.calls[0];
			obj.count = 3.7;
			tweenVars.onUpdate.call({ targets: () => [obj] });
			expect(el.textContent).toBe('hell');
		});
	});

	describe('onComplete callback', () => {
		it('restores the full text and clears locked dimensions', () => {
			const el = makeElement('hello', 120, 40);
			typewrite(el);
			const [, tweenVars] = mockGsapTo.mock.calls[0];
			tweenVars.onComplete();
			expect(el.textContent).toBe('hello');
			expect(el.style.minWidth).toBe('');
			expect(el.style.minHeight).toBe('');
		});
	});
});
