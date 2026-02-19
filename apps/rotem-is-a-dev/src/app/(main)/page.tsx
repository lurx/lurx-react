import { HeroSection } from './components/hero-section/hero-section.component';
import { Navbar } from './components/navbar/navbar.component';
import { SocialBar } from './components/social-bar/social-bar.component';
import styles from './page.module.scss';

export default function Home() {
	return (
		<div className={styles.backdrop}>
			<main className={styles.page}>
				<Navbar />
				<HeroSection />
				<SocialBar />
			</main>
		</div>
	);
}
