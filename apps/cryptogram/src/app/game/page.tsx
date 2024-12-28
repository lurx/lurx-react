import styles from './game.module.scss';
import { Board } from './components/board';
import { GameProvider } from './context/game-context';

export default function Index() {
	return (
		<GameProvider>
			<div className={styles.game}>
				<Board />
			</div>
		</GameProvider>
	);
}
