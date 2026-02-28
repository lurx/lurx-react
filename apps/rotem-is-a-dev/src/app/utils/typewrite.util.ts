import gsap from 'gsap';

type TypewriteOptions = {
	baseDuration?: number;
	charSpeed?: number;
	setDataFullText?: boolean;
}

export const typewrite = (el: HTMLElement, opts?: TypewriteOptions) => {
	const { baseDuration = 0.4, charSpeed = 0.055, setDataFullText = false } = opts ?? {};

	const full = el.textContent ?? '';
	// Lock dimensions before clearing so the layout doesn't collapse
	const { width, height } = el.getBoundingClientRect();
	el.style.minWidth = `${width}px`;
	el.style.minHeight = `${height}px`;

	if (setDataFullText) {
		el.setAttribute('data-full-text', full);
	}

	el.textContent = '';
	const obj = { count: 0 };

	return gsap.to(obj, {
		count: full.length,
		duration: Math.max(baseDuration, full.length * charSpeed),
		ease: 'none',
		onUpdate() {
			el.textContent = full.slice(0, Math.round(obj.count));
		},
		onComplete() {
			el.textContent = full;
			el.style.minWidth = '';
			el.style.minHeight = '';
		},
	});
};
