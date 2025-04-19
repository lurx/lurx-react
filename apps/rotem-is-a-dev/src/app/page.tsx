import styles from './page.module.scss';

export default function Home() {


	return (
		<main className={styles.container}>
			<div className={styles.underConstruction}>
				<h1 className={styles.title}>
					<span role="presentation">🛠️</span>
					<span>UNDER CONSTRUCTION</span>
				</h1>
				<p>Come back soon for pixel-powered greatness.</p>
			</div>
		</main>
	);
}
