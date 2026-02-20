'use client';

import { HeroBlurs } from './components/hero-blurs.component';
import { HeroIntroduction } from './components/hero-introduction.component';
import { HeroGame } from './hero-game.component';
import styles from './hero-section.module.scss';
import { HeroSnippets } from './hero-snippets.component';
import { HeroProvider } from './hero.context';

export const HeroSection = () => {
	return (
		<HeroProvider>
			<section className={styles.hero}>
				<HeroBlurs />
				<HeroIntroduction />

				<div className={styles.right}>
					<HeroGame />
					<HeroSnippets />
				</div>
			</section>
		</HeroProvider>
	);
};
