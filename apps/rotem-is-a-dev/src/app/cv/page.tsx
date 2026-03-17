import { PdfPreview } from './components/pdf-preview';
import styles from './page.module.scss';

export default function CV() {
	return (
		<div className={styles.pdfPage}>
			<PdfPreview />
		</div>
	);
}
