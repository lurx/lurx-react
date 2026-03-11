import 'regenerator-runtime/runtime';
import { RgeBrickfallGame as RgeBrickfallGameImpl } from './rge-brickfall-game.component';
import type { RgeBrickfallGameProps } from './rge-brickfall-game.component';

export const RgeBrickfallGame = (props: RgeBrickfallGameProps) => {
	return <RgeBrickfallGameImpl {...props} />;
};
