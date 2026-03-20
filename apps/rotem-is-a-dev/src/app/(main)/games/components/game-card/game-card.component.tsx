import styles from './game-card.module.scss';
import type { GameCardProps } from './game-card.types';

export const GameCard = ({ game, onPlayAction }: GameCardProps) => {
	const PreviewComponent = game.preview;
	const handlePlay = () => onPlayAction(game);

	return (
		<article
			className={styles.card}
			aria-label={`Game: ${game.slug}`}
		>
			<p className={styles.cardTitle}>
				<span className={styles.cardTitleNumber}>Game {game.number}</span>
				<span className={styles.cardTitleSeparator}> {'//'} </span>
				<span className={styles.cardTitleSlug}>{game.slug}</span>
			</p>

			<div className={styles.cardBody}>
				<div className={styles.imageWrapper}>
					<div className={styles.previewContainer} aria-hidden="true">
						<div className={styles.previewScaler}>
							<PreviewComponent />
						</div>
					</div>
				</div>

				<div className={styles.textContent}>
					<p className={styles.description}>{game.description}</p>
				</div>

				<div className={styles.footer}>
					<button
						type="button"
						className={styles.playButton}
						onClick={handlePlay}
					>
						play-game
					</button>
				</div>
			</div>
		</article>
	);
};
