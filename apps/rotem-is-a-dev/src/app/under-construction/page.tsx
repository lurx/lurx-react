import styles from './page.module.scss';

export default function UnderConstructionPage() {
	return (
		<div className={styles.underConstruction}>
			<h1 className={styles.title}>
				<span role="presentation">🛠️</span>
				<span>UNDER CONSTRUCTION</span>
			</h1>
			<p>Come back soon for pixel-powered greatness.</p>
		</div>
	);
}
