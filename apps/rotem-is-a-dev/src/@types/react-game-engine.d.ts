declare module 'react-game-engine' {
	import type { Component, CSSProperties, ReactNode } from 'react';

	type GameEngineProps = {
		systems?: unknown[];
		entities?: Record<string, unknown>;
		running?: boolean;
		onEvent?: (event: { type: string }) => void;
		style?: CSSProperties;
		className?: string;
		children?: ReactNode;
		timer?: unknown;
		renderer?: (entities: Record<string, unknown>, window: Window) => ReactNode;
	};

	class GameEngine extends Component<GameEngineProps> {
		start: () => void;
		stop: () => void;
		swap: (newEntities: Record<string, unknown>) => Promise<void>;
		dispatch: (event: { type: string }) => void;
	}

	export { GameEngine };
}
