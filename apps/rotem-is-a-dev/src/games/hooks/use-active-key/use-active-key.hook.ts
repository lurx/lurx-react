import { useEffect, useState } from 'react';
import type { KeyMap } from './use-active-key.types';

export const useActiveKey = <T extends string>(keyMap: KeyMap<T>): T | null => {
	const [activeKey, setActiveKey] = useState<T | null>(null);

	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			const mapped = keyMap[event.key];
			if (mapped) setActiveKey(mapped);
		};

		const handleKeyUp = () => setActiveKey(null);

		globalThis.addEventListener('keydown', handleKeyDown);
		globalThis.addEventListener('keyup', handleKeyUp);

		return () => {
			globalThis.removeEventListener('keydown', handleKeyDown);
			globalThis.removeEventListener('keyup', handleKeyUp);
		};
	}, [keyMap]);

	return activeKey;
};
