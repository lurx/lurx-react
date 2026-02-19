interface DialogProps {
	isOpen: boolean;
}

export const Dialog = ({ isOpen = false }: DialogProps) => {
	return (
		<dialog open={isOpen}>
			<p>This is a dialog.</p>
		</dialog>
	);
};
