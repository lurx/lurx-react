import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import styles from './tab-context-menu.module.scss';
import type { TabContextMenuProps } from './tab-context-menu.types';

export const TabContextMenu = ({
	position,
	onCloseAction,
	onCloseOthersAction,
	onCloseAllAction,
	onDismissAction,
}: TabContextMenuProps) => {
	const menuRef = useRef<HTMLMenuElement>(null);

	useEffect(() => {
		const handleMouseDown = (event: MouseEvent) => {
			if (menuRef.current && event.target instanceof Node && !menuRef.current.contains(event.target)) {
				onDismissAction();
			}
		};

		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				onDismissAction();
			}
		};

		document.addEventListener('mousedown', handleMouseDown);
		document.addEventListener('keydown', handleKeyDown);
		return () => {
			document.removeEventListener('mousedown', handleMouseDown);
			document.removeEventListener('keydown', handleKeyDown);
		};
	}, [onDismissAction]);

	const handleAction = (action: () => void) => {
		action();
		onDismissAction();
	};

	const handleCloseClick = () => handleAction(onCloseAction);
	const handleCloseOthersClick = () => handleAction(onCloseOthersAction);
	const handleCloseAllClick = () => handleAction(onCloseAllAction);

	return createPortal(
		<menu
			ref={menuRef}
			className={styles.menu}
			style={{ top: position.y, left: position.x }}
			data-testid="tab-context-menu"
		>
			<li>
				<button
					type="button"
					className={styles.item}
					onClick={handleCloseClick}
				>
					Close
				</button>
			</li>
			<li>
				<button
					type="button"
					className={styles.item}
					onClick={handleCloseOthersClick}
				>
					Close Others
				</button>
			</li>
			<li>
				<button
					type="button"
					className={styles.item}
					onClick={handleCloseAllClick}
				>
					Close All
				</button>
			</li>
		</menu>,
		document.getElementById('portal-root') ?? document.body,
	);
};
