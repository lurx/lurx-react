import styles from '../../snake-game.module.scss';
import { ArrowKey } from './arrow-key.component';
import { ARROW_DIRECTIONS } from './arrow-keys.constants';

export const ArrowKeys = () => (
		<div
			className={styles.arrowKeys}
			aria-label="Arrow key controls"
		>
			{ARROW_DIRECTIONS.map(key => (
				<ArrowKey
					key={key}
					direction={key}
				/>
			))}
		</div>
	);
