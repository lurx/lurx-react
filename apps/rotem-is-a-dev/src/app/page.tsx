import { Card } from './components/card';
import { Flex } from './components/flex';
import styles from './page.module.scss';
import { Experience, Header, Languages, Portfolio, Skills } from './sections';

export default function Home() {
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
			<Portfolio />
		</div>
	);
}
