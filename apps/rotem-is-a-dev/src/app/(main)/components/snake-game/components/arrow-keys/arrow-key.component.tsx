import { FaIcon } from '@/app/components';
import classNames from 'classnames';
import { useSnakeGame } from '../../hooks/use-snake-game.hook';
import styles from '../../snake-game.module.scss';
import { KEY_LABELS } from './arrow-keys.constants';
import type { ArrowKeyProps } from './arrow-key.types';

export const ArrowKey = ({ direction }: ArrowKeyProps) => {
	const { activeKey } = useSnakeGame();
	const isActive = activeKey === direction;

	const iconName = KEY_LABELS[direction];
	const directionClassName = direction.replace('Arrow', '').toLowerCase();

	return (
		<div
			className={classNames(styles.arrowKey, styles[directionClassName], {
				[styles.pressed]: isActive,
			})}
			aria-label={direction.replace('Arrow', '')}
		>
			<FaIcon
				iconName={iconName}
				iconGroup="fass"
			/>
		</div>
	);
};
