export type SendMessageFieldErrors = {
	name?: string;
	email?: string;
	message?: string;
};

export type SendMessageState =
	| { status: 'idle' }
	| { status: 'success' }
	| { status: 'error'; message: string; fieldErrors?: SendMessageFieldErrors };

export type SendMessageInput = {
	name: string;
	email: string;
	subject: string;
	message: string;
	sendCopy: boolean;
};
