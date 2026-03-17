import { flushSync } from 'react-dom';
import { createRoot } from 'react-dom/client';
import CV from '../page';
import type { OffscreenResult } from './render-cv-offscreen.types';

const CV_CUSTOM_PROPERTIES: Record<string, string> = {
	'--spacing-unit': '8px',
	'--color-bg': '#f8fafc',
	'--color-surface': '#ffffff',
	'--color-border': '#e2e8f0',
	'--color-text': '#0f172a',
	'--color-text-muted': '#64748b',
	'--color-accent': '#2563eb',
	'--color-accent-hover': '#3b82f6',
};

/**
 * Element-level styles from cv/styles/global.scss scoped under .cv-offscreen
 * so they don't leak into the host page.
 */
const SCOPED_STYLES = `
.cv-offscreen {
	box-sizing: border-box;
	background-color: var(--color-bg);
	color: var(--color-text);
	font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
	line-height: 1.6;
	-webkit-font-smoothing: antialiased;
}
.cv-offscreen *, .cv-offscreen *::before, .cv-offscreen *::after {
	box-sizing: border-box;
	margin: 0;
	padding: 0;
}
.cv-offscreen .container {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: calc(3 * var(--spacing-unit));
	gap: calc(2 * var(--spacing-unit));
	max-width: 720px;
	margin: 0 auto;
}
.cv-offscreen h1 {
	font-size: 2rem;
	font-weight: 700;
	letter-spacing: -0.02em;
	line-height: 1.2;
}
.cv-offscreen h2 {
	font-size: 1rem;
	font-weight: 400;
	color: var(--color-text-muted);
	letter-spacing: 0.02em;
}
.cv-offscreen h3 {
	font-size: 0.75rem;
	font-weight: 600;
	text-transform: uppercase;
	letter-spacing: 0.08em;
	color: var(--color-accent);
	margin-bottom: calc(1.5 * var(--spacing-unit));
}
.cv-offscreen ul {
	list-style: none;
	padding: 0;
}
.cv-offscreen li {
	position: relative;
	padding-left: calc(2 * var(--spacing-unit));
}
.cv-offscreen li::before {
	content: '';
	position: absolute;
	left: 0;
	top: 0.7em;
	width: 4px;
	height: 4px;
	border-radius: 50%;
	background-color: var(--color-accent);
}
`;

export function renderCvOffscreen(): OffscreenResult {
	const wrapper = document.createElement('div');
	wrapper.className = 'cv-offscreen';
	Object.assign(wrapper.style, {
		position: 'fixed',
		left: '-9999px',
		top: '0',
		width: '760px',
		zIndex: '-1',
		pointerEvents: 'none',
	});

	for (const [prop, value] of Object.entries(CV_CUSTOM_PROPERTIES)) {
		wrapper.style.setProperty(prop, value);
	}

	const styleEl = document.createElement('style');
	styleEl.textContent = SCOPED_STYLES;
	document.head.appendChild(styleEl);

	document.body.appendChild(wrapper);

	const root = createRoot(wrapper);
	flushSync(() => {
		root.render(<CV searchParams={Promise.resolve({})} />);
	});

	const container = wrapper.querySelector<HTMLElement>('.container');
	if (!container) {
		root.unmount();
		wrapper.remove();
		styleEl.remove();
		throw new Error('CV .container element not found after offscreen render');
	}

	return {
		container,
		cleanup: () => {
			root.unmount();
			wrapper.remove();
			styleEl.remove();
		},
	};
}
