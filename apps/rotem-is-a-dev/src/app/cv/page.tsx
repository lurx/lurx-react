import { Flex } from '../components/flex';
import { Card } from './components/card';
import { PdfPreview } from './components/pdf-preview';
import styles from './page.module.scss';
import { Experience, Header, Languages, Skills } from './sections';
import type { CvPageProps } from './page.types';

export default async function CV({ searchParams }: CvPageProps) {
	const params = await searchParams;
	const isNewPdf = 'new-pdf' in params;

	if (isNewPdf) {
		return (
			<div style={{ width: '100vw', height: '100vh' }}>
				<PdfPreview />
			</div>
		);
	}

	return (
		<div className="container">
			<div className={styles.columns}>
				<div className={styles.left}>
					<Header />
					<Experience />
				</div>
				<div className={styles.right}>
					<Card>
						<Flex
							direction="column"
							gap="xlarge"
						>
							<Skills />
							<Languages />
						</Flex>
					</Card>
				</div>
			</div>
		</div>
	);
}
