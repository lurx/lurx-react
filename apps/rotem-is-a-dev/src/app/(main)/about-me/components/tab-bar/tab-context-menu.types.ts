export type TabContextMenuProps = {
	position: { x: number; y: number };
	onCloseAction: () => void;
	onCloseOthersAction: () => void;
	onCloseAllAction: () => void;
	onDismissAction: () => void;
}
