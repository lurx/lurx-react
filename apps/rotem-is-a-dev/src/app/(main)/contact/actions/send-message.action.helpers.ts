import type { SendMessageFieldErrors, SendMessageInput } from './send-message.action.types';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_MESSAGE_LENGTH = 10;
const MAX_MESSAGE_LENGTH = 5000;
const MAX_NAME_LENGTH = 120;
const MAX_SUBJECT_LENGTH = 200;

export const DEFAULT_SUBJECT = 'Hello Rotem';

export const parseFormInput = (formData: FormData): SendMessageInput => ({
	name: String(formData.get('name') ?? '').trim(),
	email: String(formData.get('email') ?? '').trim(),
	subject: String(formData.get('subject') ?? '').trim() || DEFAULT_SUBJECT,
	message: String(formData.get('message') ?? '').trim(),
	sendCopy: formData.get('sendCopy') === 'on',
});

export const isHoneypotFilled = (formData: FormData): boolean => {
	const value = formData.get('website');
	return typeof value === 'string' && value.trim().length > 0;
};

export const validateInput = (input: SendMessageInput): SendMessageFieldErrors => {
	const errors: SendMessageFieldErrors = {};

	if (!input.name) {
		errors.name = 'Name is required.';
	} else if (input.name.length > MAX_NAME_LENGTH) {
		errors.name = `Keep it under ${MAX_NAME_LENGTH} characters.`;
	}

	if (!input.email) {
		errors.email = 'Email is required.';
	} else if (!EMAIL_PATTERN.test(input.email)) {
		errors.email = 'That doesn\'t look like a valid email.';
	}

	if (!input.message) {
		errors.message = 'Message is required.';
	} else if (input.message.length < MIN_MESSAGE_LENGTH) {
		errors.message = `At least ${MIN_MESSAGE_LENGTH} characters, please.`;
	} else if (input.message.length > MAX_MESSAGE_LENGTH) {
		errors.message = `Keep it under ${MAX_MESSAGE_LENGTH} characters.`;
	}

	return errors;
};

export const hasErrors = (errors: SendMessageFieldErrors): boolean =>
	Object.values(errors).some(Boolean);

export const truncateSubject = (subject: string): string =>
	subject.slice(0, MAX_SUBJECT_LENGTH);

const escapeHtml = (raw: string): string =>
	raw
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#039;');

export const buildOwnerHtml = (input: SendMessageInput): string => {
	const safeName = escapeHtml(input.name);
	const safeEmail = escapeHtml(input.email);
	const safeMessage = escapeHtml(input.message).replace(/\n/g, '<br>');

	return `
		<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #1a1a1a;">
			<p style="margin: 0 0 16px;"><strong>From:</strong> ${safeName} &lt;${safeEmail}&gt;</p>
			<p style="margin: 0 0 16px;"><strong>Subject:</strong> ${escapeHtml(input.subject)}</p>
			<hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 16px 0;" />
			<div>${safeMessage}</div>
		</div>
	`;
};

export const buildSenderCopyHtml = (input: SendMessageInput): string => {
	const safeMessage = escapeHtml(input.message).replace(/\n/g, '<br>');

	return `
		<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #1a1a1a;">
			<p style="margin: 0 0 16px;">Hi ${escapeHtml(input.name)},</p>
			<p style="margin: 0 0 16px;">Thanks for reaching out — I got your message and will reply as soon as I can. For your records, here's a copy of what you sent:</p>
			<hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 16px 0;" />
			<p style="margin: 0 0 8px;"><strong>Subject:</strong> ${escapeHtml(input.subject)}</p>
			<div style="margin-top: 12px;">${safeMessage}</div>
			<hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 16px 0;" />
			<p style="margin: 0; color: #64748b; font-size: 13px;">— Rotem</p>
		</div>
	`;
};
