'use server';

import { Resend } from 'resend';
import {
	buildOwnerHtml,
	buildSenderCopyHtml,
	hasErrors,
	isHoneypotFilled,
	parseFormInput,
	truncateSubject,
	validateInput,
} from './send-message.action.helpers';
import type { SendMessageState } from './send-message.action.types';

const FROM_ADDRESS = 'Rotem Contact Form <onboarding@resend.dev>';
const GENERIC_ERROR = 'Something went wrong sending your message. Please try again in a moment.';
const NOT_CONFIGURED_ERROR = 'Contact form is temporarily unavailable. Please email me directly.';

export const sendMessageAction = async (
	_previousState: SendMessageState,
	formData: FormData,
): Promise<SendMessageState> => {
	if (isHoneypotFilled(formData)) {
		return { status: 'success' };
	}

	const input = parseFormInput(formData);
	const fieldErrors = validateInput(input);

	if (hasErrors(fieldErrors)) {
		return {
			status: 'error',
			message: 'Please fix the highlighted fields.',
			fieldErrors,
		};
	}

	const apiKey = process.env.RESEND_API_KEY;
	const toAddress = process.env.NEXT_PUBLIC_CONTACT_EMAIL;

	if (!apiKey || !toAddress) {
		return { status: 'error', message: NOT_CONFIGURED_ERROR };
	}

	const resend = new Resend(apiKey);
	const subject = truncateSubject(input.subject);

	try {
		const ownerResult = await resend.emails.send({
			from: FROM_ADDRESS,
			to: toAddress,
			replyTo: input.email,
			subject: `[Portfolio] ${subject} — from ${input.name}`,
			html: buildOwnerHtml(input),
		});

		if (ownerResult.error) {
			return { status: 'error', message: GENERIC_ERROR };
		}

		if (input.sendCopy) {
			const copyResult = await resend.emails.send({
				from: FROM_ADDRESS,
				to: input.email,
				subject: `Copy of your message: ${subject}`,
				html: buildSenderCopyHtml(input),
			});

			// The message itself already reached its destination, so the send is a
			// success even when the courtesy copy bounces — failing here would ask
			// the sender to try again and mail me a duplicate. Log it instead.
			if (copyResult.error) {
				console.error('Sender copy failed to send', copyResult.error);
			}
		}

		return { status: 'success' };
	} catch {
		return { status: 'error', message: GENERIC_ERROR };
	}
};
