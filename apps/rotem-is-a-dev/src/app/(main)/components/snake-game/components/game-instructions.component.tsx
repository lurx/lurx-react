import styles from '../snake-game.module.scss';

export const SnakeGameInstructions = () => (
	<div className={styles.navComments}>
		<p className={styles.comment}>{'// use keyboard'}</p>
		<p className={styles.comment}>{'// arrows to play'}</p>
	</div>
);
