import type { Game } from '../../data/games.types';

export type GameDialogProps = {
	game: Nullable<Game>;
	onCloseAction: () => void;
};
