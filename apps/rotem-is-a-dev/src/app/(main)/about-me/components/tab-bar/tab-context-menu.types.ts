export type TabContextMenuProps = {
	position: { x: number; y: number };
	onClose: () => void;
	onCloseOthers: () => void;
	onCloseAll: () => void;
	onDismiss: () => void;
}
