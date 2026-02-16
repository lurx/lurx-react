import { Experience, Header, Languages, Skills } from './sections';
import styles from './page.module.scss';

export default function Home() {
	return (
		<div className="container">
			<div className={styles.left}>
				<Header />
				<Experience />
			</div>
			<div className={styles.right}>
				<Skills />
				<Languages />
			</div>
		</div>
	);
}
