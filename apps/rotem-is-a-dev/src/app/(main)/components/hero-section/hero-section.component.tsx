'use client';

import { useState } from 'react';
import { SnakeGame } from '../snake-game/snake-game.component';
import styles from './hero-section.module.scss';

const GITHUB_URL = 'https://github.com/lurx';
const BG_BLURS_URL =
	'https://www.figma.com/api/mcp/asset/da975ad8-ea6d-42ab-8d67-e6c81a04e1eb';

export const HeroSection = () => {
	const [githubRevealed, setGithubRevealed] = useState(false);

	const handleWin = () => setGithubRevealed(true);
	const handleSkip = () => setGithubRevealed(true);

	return (
		<section className={styles.hero}>
			<img
				src={BG_BLURS_URL}
				alt=""
				className={styles.bgBlurs}
				aria-hidden="true"
			/>
			<div className={styles.left}>
				<p className={styles.greeting}>Hi all. I am</p>
				<h1 className={styles.name}>Rotem Horovitz</h1>
				<p className={styles.role}>&gt; Front-end developer</p>

				<div className={styles.codeBlock}>
					<p className={`${styles.codeLine} ${styles.commentText}`}>
						{'// complete the game to continue'}
					</p>
					<p className={`${styles.codeLine} ${styles.commentText}`}>
						{'// find my profile on Github:'}
					</p>
					<p
						className={`${styles.codeLine} ${styles.constLine}${
							!githubRevealed ? ` ${styles.hidden}` : ''
						}`}
					>
						<span className={styles.keyword}>const&nbsp;</span>
						<span className={styles.varName}>githubLink</span>
						<span className={styles.equals}>&nbsp;=&nbsp;</span>
						<a
							href={GITHUB_URL}
							target="_blank"
							rel="noopener noreferrer"
							className={styles.stringValue}
							aria-label="GitHub profile"
						>
							&quot;{GITHUB_URL}&quot;
						</a>
					</p>
				</div>
			</div>

			<div className={styles.right}>
				<SnakeGame
					onWin={handleWin}
					onSkip={handleSkip}
				/>
			</div>
		</section>
	);
};
