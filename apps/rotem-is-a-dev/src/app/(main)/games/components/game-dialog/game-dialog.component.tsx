import { Dialog } from '@/app/components/dialog';
import styles from './game-dialog.module.scss';
import type { GameDialogProps } from './game-dialog.types';

export const GameDialog = ({ game, onCloseAction }: GameDialogProps) => {
	const GameComponent = game?.game ?? null;

	return (
		<Dialog
			isOpen={game !== null}
			onCloseAction={onCloseAction}
			ariaLabel={game ? `Play ${game.slug}` : 'Game dialog'}
			className={styles.dialog}
			fullScreen
		>
			{GameComponent && <GameComponent />}
		</Dialog>
	);
};
