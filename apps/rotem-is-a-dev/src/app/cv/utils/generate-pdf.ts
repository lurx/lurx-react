import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const expandCollapsibles = (): HTMLButtonElement[] => {
	const buttons = Array.from(document.querySelectorAll<HTMLButtonElement>('button'));
	const showMoreButtons = buttons.filter(btn => btn.textContent?.startsWith('Show More'));
	showMoreButtons.forEach(btn => btn.click());
	return showMoreButtons;
};

const collapseCollapsibles = () => {
	const buttons = Array.from(document.querySelectorAll<HTMLButtonElement>('button'));
	buttons.filter(btn => btn.textContent === 'Show Less').forEach(btn => btn.click());
};

export const generateCvPdf = async (): Promise<void> => {
	const root = document.documentElement;
	const originalTheme = root.getAttribute('data-theme');

	root.setAttribute('data-theme', 'light');
	expandCollapsibles();
	await new Promise(resolve => setTimeout(resolve, 200));

	const element = document.querySelector<HTMLElement>('.container');
	if (!element) return;

	const canvas = await html2canvas(element, {
		scale: 2,
		allowTaint: true,
		scrollX: 0,
		scrollY: 0,
		// 760px keeps us below the 1024px desktop breakpoint → single-column
		// tablet layout (max-width 720px), which fills A4 at a readable size.
		// Do NOT set `height` here — the clone renders in single-column mode
		// (taller than the desktop two-column layout) so we let html2canvas
		// measure the clone's actual scroll height instead.
		windowWidth: 760,
		onclone: (_doc, clonedElement) => {
			// Hide avatar images — Next.js /_next/image proxy can't be resolved
			// by html2canvas, so hide the whole avatar container rather than show
			// a broken or empty circle.
			clonedElement.querySelectorAll<HTMLImageElement>('img').forEach(img => {
				const container = img.parentElement;
				if (container) container.style.display = 'none';
			});

			// Replace contact link labels (Email, Phone, LinkedIn, GitHub) with their
			// actual values so the PDF is useful as a standalone document.
			// Icons are kept; only the visible <span> text is replaced.
			clonedElement.querySelectorAll<HTMLAnchorElement>('a').forEach(link => {
				const span = link.querySelector('span');
				if (!span) return;
				const href = link.getAttribute('href') ?? '';
				if (href.startsWith('mailto:')) {
					span.textContent = href.slice('mailto:'.length);
				} else if (href.startsWith('tel:')) {
					span.textContent = href.slice('tel:'.length);
				} else if (href.startsWith('https://')) {
					span.textContent = href.slice('https://'.length);
				}
			});

			// Hide the portfolio section — content is placeholder and not ready for print.
			const portfolio = clonedElement.querySelector<HTMLElement>('#portfolio');
			if (portfolio) portfolio.style.display = 'none';

			// Hide Show More / Show Less toggle buttons so they don't appear in the PDF.
			clonedElement.querySelectorAll<HTMLButtonElement>('button').forEach(btn => {
				const text = btn.textContent ?? '';
				if (text.startsWith('Show More') || text === 'Show Less') {
					btn.style.display = 'none';
				}
			});

			// PDF-specific style overrides injected into the clone.
			const pdfStyle = _doc.createElement('style');
			pdfStyle.textContent = `
				/* Zero out --color-border so card outlines and experience separators
				   disappear cleanly. Skill tags use --skill-progress-color, so their
				   borders are unaffected by this change. */
				:root, [data-theme="light"] {
					--color-border: transparent !important;
					/* Use true black for body copy so text is crisp on paper */
					--color-text: #000000 !important;
					--color-text-muted: #111111 !important;
				}
				/* Larger, more prominent section headings */
				h3 { font-size: 0.9rem !important; }
			`;
			_doc.head.appendChild(pdfStyle);
		},
	});

	collapseCollapsibles();

	if (originalTheme) {
		root.setAttribute('data-theme', originalTheme);
	} else {
		root.removeAttribute('data-theme');
	}

	const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
	const pageW = pdf.internal.pageSize.getWidth();
	const pageH = pdf.internal.pageSize.getHeight();

	// Margins in mm.
	const margin = { top: 12, bottom: 12, left: 12, right: 12 };
	const usableW = pageW - margin.left - margin.right;
	const usableH = pageH - margin.top - margin.bottom;

	// How many canvas pixels correspond to one mm of usable width.
	const pxPerMm = canvas.width / usableW;
	// Nominal height of one page slice in canvas pixels.
	const slicePx = Math.round(usableH * pxPerMm);

	// Smart page-break: scan backwards from the nominal break point to find the
	// nearest whitespace row (inter-line or inter-element gap) for a clean cut.
	// All jobs live inside one Experience card, so between bullet points the
	// background is card-white (#ffffff), not the page background (#f8fafc).
	// Matching by background color therefore misses within-card gaps.
	// Instead we use a luminance threshold: a row with ≤ 10 pixels darker than
	// luminance 210 is pure whitespace and safe to split at, whether it's an
	// inter-card gap, line-spacing gap, or spacing between list items.
	const findNaturalBreak = (targetY: number): number => {
		const readCtx = canvas.getContext('2d');
		if (!readCtx || targetY >= canvas.height) return Math.min(targetY, canvas.height);

		// Search up to 35 % of page height above the nominal break point.
		const searchPx = Math.round(slicePx * 0.35);
		const top = Math.max(0, targetY - searchPx);
		const height = targetY - top;
		if (height <= 0) return targetY;

		const { data } = readCtx.getImageData(0, top, canvas.width, height);

		// Scan backwards (from nominal break upward) for the nearest row whose
		// dark-pixel count is at most 10. "Dark" = luminance < 210 (catches
		// text, borders, icons but ignores light tints and anti-aliasing edges).
		for (let row = height - 1; row >= 0; row--) {
			let dark = 0;
			for (let col = 0; col < canvas.width; col++) {
				const i = (row * canvas.width + col) * 4;
				if (0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2] < 210) {
					if (++dark > 10) break; // row has too much content — skip
				}
			}
			if (dark <= 10) return top + row;
		}

		// No clean whitespace found in the search window — fall back to the
		// nominal cut so rendering never stalls.
		return targetY;
	};

	// Draw each page as its own canvas slice so jsPDF never needs to clip or
	// bleed the image across page boundaries — each page gets exactly the
	// content that belongs to it, placed within the margins.
	let yPx = 0;
	while (yPx < canvas.height) {
		if (yPx > 0) pdf.addPage();

		const breakY = findNaturalBreak(yPx + slicePx);
		const sliceH = Math.min(breakY, canvas.height) - yPx;
		if (sliceH <= 0) break;

		const sliceCanvas = document.createElement('canvas');
		sliceCanvas.width = canvas.width;
		sliceCanvas.height = sliceH;
		const sliceCtx = sliceCanvas.getContext('2d');
		if (sliceCtx) {
			sliceCtx.drawImage(canvas, 0, yPx, canvas.width, sliceH, 0, 0, canvas.width, sliceH);
		}

		const sliceImgH = sliceH / pxPerMm;
		pdf.addImage(sliceCanvas.toDataURL('image/png'), 'PNG', margin.left, margin.top, usableW, sliceImgH);
		yPx += sliceH;
	}

	pdf.save('rotem-horovitz-cv.pdf');
};
