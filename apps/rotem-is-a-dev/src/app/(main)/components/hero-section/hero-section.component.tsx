'use client';

import { useResponsive } from '@/hooks';
import classNames from 'classnames';
import { HeroBlurs } from './components/hero-blurs.component';
import { HeroGameDialog } from './components/hero-game-dialog';
import { HeroGameTrigger } from './components/hero-game-trigger';
import { HeroIntroduction } from './components/hero-introduction.component';
import { HeroSnippets } from './components/hero-snippets/hero-snippets.component';
import { useHeroEntryAnimation } from './hooks/use-hero-entry-animation.hook';
import styles from './hero-section.module.scss';
import { HeroProvider } from './hero.context';

export const HeroSection = () => {
	const { isMobile } = useResponsive();
	const isRevealed = useHeroEntryAnimation();

	const carouselAxis = isMobile ? 'x' : 'y';

	return (
		<HeroProvider>
			<section
				className={classNames(styles.hero, { [styles.heroHidden]: !isRevealed })}
			>
				<HeroBlurs />
				<HeroIntroduction />

				<div className={styles.right}>
					<HeroSnippets key={carouselAxis} axis={carouselAxis} />
					{!isMobile && <HeroGameTrigger />}
				</div>

				{!isMobile && <HeroGameDialog />}
			</section>
		</HeroProvider>
	);
};
