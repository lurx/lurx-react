import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import styles from './tab-context-menu.module.scss';
import type { TabContextMenuProps } from './tab-context-menu.types';

export const TabContextMenu = ({
	position,
	onClose,
	onCloseOthers,
	onCloseAll,
	onDismiss,
}: TabContextMenuProps) => {
	const menuRef = useRef<HTMLMenuElement>(null);

	useEffect(() => {
		const handleMouseDown = (event: MouseEvent) => {
			if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
				onDismiss();
			}
		};

		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				onDismiss();
			}
		};

		document.addEventListener('mousedown', handleMouseDown);
		document.addEventListener('keydown', handleKeyDown);
		return () => {
			document.removeEventListener('mousedown', handleMouseDown);
			document.removeEventListener('keydown', handleKeyDown);
		};
	}, [onDismiss]);

	const handleAction = (action: () => void) => {
		action();
		onDismiss();
	};

	const handleCloseClick = () => handleAction(onClose);
	const handleCloseOthersClick = () => handleAction(onCloseOthers);
	const handleCloseAllClick = () => handleAction(onCloseAll);

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
