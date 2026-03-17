'use client';

import dynamic from 'next/dynamic';
import styles from './page.module.scss';

const PdfPreview = dynamic(
	() =>
		import('./components/pdf-preview').then(mod => ({
			default: mod.PdfPreview,
		})),
	{ ssr: false },
);

export default function CV() {
	return (
		<div className={styles.pdfPage}>
			<PdfPreview />
		</div>
	);
}
