export type ContactFormValues = {
	name: string;
	email: string;
	subject: string;
	message: string;
	sendCopy: boolean;
};

export type ContactFormProps = {
	onSuccessAction?: () => void;
};
