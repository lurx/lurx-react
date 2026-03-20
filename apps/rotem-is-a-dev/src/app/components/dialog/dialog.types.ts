export type DialogProps = {
	isOpen: boolean;
	onCloseAction: () => void;
	ariaLabel: string;
	className?: string;
	fullScreen?: boolean;
};
