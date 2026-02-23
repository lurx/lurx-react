import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export const generateCvPdf = async (targetElement?: HTMLElement): Promise<void> => {
	const element = targetElement ?? document.querySelector<HTMLElement>('.container');
	if (!element) return;

	const canvas = await html2canvas(element, {
		scale: 2,
		allowTaint: true,
		scrollX: 0,
		scrollY: 0,
		// 760px keeps us below the 1024px desktop breakpoint → single-column
		// tablet layout (max-width 720px), which fills A4 at a readable size.
		windowWidth: 760,
		onclone: (_doc, clonedElement) => {
			// Replace contact link labels (Email, Phone, LinkedIn, GitHub) with their
			// actual values so the PDF is useful as a standalone document.
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

			// PDF-specific style overrides injected into the clone.
			const pdfStyle = _doc.createElement('style');
			pdfStyle.textContent = `
				:root {
					--color-border: transparent !important;
					--color-text: #000000 !important;
					--color-text-muted: #111111 !important;
				}
				h3 { font-size: 0.9rem !important; }
			`;
			_doc.head.appendChild(pdfStyle);
		},
	});

	const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
	const pageW = pdf.internal.pageSize.getWidth();
	const pageH = pdf.internal.pageSize.getHeight();

	const margin = { top: 12, bottom: 12, left: 12, right: 12 };
	const usableW = pageW - margin.left - margin.right;
	const usableH = pageH - margin.top - margin.bottom;

	const pxPerMm = canvas.width / usableW;
	const slicePx = Math.round(usableH * pxPerMm);

	// Smart page-break: scan backwards from the nominal break point to find the
	// nearest whitespace row for a clean cut. A row with ≤ 10 pixels darker than
	// luminance 210 is pure whitespace and safe to split at.
	const findNaturalBreak = (targetY: number): number => {
		const readCtx = canvas.getContext('2d');
		if (!readCtx || targetY >= canvas.height) return Math.min(targetY, canvas.height);

		const searchPx = Math.round(slicePx * 0.35);
		const top = Math.max(0, targetY - searchPx);
		const height = targetY - top;
		if (height <= 0) return targetY;

		const { data } = readCtx.getImageData(0, top, canvas.width, height);

		for (let row = height - 1; row >= 0; row--) {
			let dark = 0;
			for (let col = 0; col < canvas.width; col++) {
				const index = (row * canvas.width + col) * 4;
				if (0.299 * data[index] + 0.587 * data[index + 1] + 0.114 * data[index + 2] < 210) {
					if (++dark > 10) break;
				}
			}
			if (dark <= 10) return top + row;
		}

		return targetY;
	};

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
