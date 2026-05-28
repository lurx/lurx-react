'use client';

import classNames from 'classnames';
import { type ChangeEvent, useActionState, useCallback, useEffect, useId, useState } from 'react';
import { sendMessageAction } from '../../actions/send-message.action';
import type { SendMessageState } from '../../actions/send-message.action.types';
import { contactFormStrings } from './contact-form.strings';
import styles from './contact-form.module.scss';
import type { ContactFormProps, ContactFormValues } from './contact-form.types';

const INITIAL_STATE: SendMessageState = { status: 'idle' };

const INITIAL_VALUES: ContactFormValues = {
	name: '',
	email: '',
	subject: '',
	message: '',
	sendCopy: false,
};

export const ContactForm = ({ onSuccessAction }: ContactFormProps) => {
	const [values, setValues] = useState<ContactFormValues>(INITIAL_VALUES);
	const [state, formAction, isPending] = useActionState(sendMessageAction, INITIAL_STATE);

	const nameId = useId();
	const emailId = useId();
	const subjectId = useId();
	const messageId = useId();
	const sendCopyId = useId();

	const fieldErrors = state.status === 'error' ? state.fieldErrors : undefined;
	const topLevelError = state.status === 'error' ? state.message : null;

	const handleTextChange = useCallback((event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { name, value } = event.target;
		setValues(previous => ({ ...previous, [name]: value }));
	}, []);

	const handleCheckboxChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
		const { name, checked } = event.target;
		setValues(previous => ({ ...previous, [name]: checked }));
	}, []);

	useEffect(() => {
		if (state.status === 'success') {
			setValues(INITIAL_VALUES);
			onSuccessAction?.();
		}
	}, [state.status, onSuccessAction]);

	return (
		<form
			action={formAction}
			className={styles.form}
			noValidate
		>
			{topLevelError && (
				<p className={styles.formError} role="alert">
					{topLevelError}
				</p>
			)}

			<div className={styles.field}>
				<label htmlFor={nameId} className={styles.label}>
					{contactFormStrings.nameLabel}
				</label>
				<input
					id={nameId}
					name="name"
					type="text"
					value={values.name}
					onChange={handleTextChange}
					className={classNames(styles.input, { [styles.inputError]: Boolean(fieldErrors?.name) })}
					placeholder={contactFormStrings.namePlaceholder}
					disabled={isPending}
					aria-invalid={Boolean(fieldErrors?.name)}
					aria-describedby={fieldErrors?.name ? `${nameId}-error` : undefined}
					required
				/>
				{fieldErrors?.name && (
					<span id={`${nameId}-error`} className={styles.fieldError}>
						{fieldErrors.name}
					</span>
				)}
			</div>

			<div className={styles.field}>
				<label htmlFor={emailId} className={styles.label}>
					{contactFormStrings.emailLabel}
				</label>
				<input
					id={emailId}
					name="email"
					type="email"
					value={values.email}
					onChange={handleTextChange}
					className={classNames(styles.input, { [styles.inputError]: Boolean(fieldErrors?.email) })}
					placeholder={contactFormStrings.emailPlaceholder}
					disabled={isPending}
					aria-invalid={Boolean(fieldErrors?.email)}
					aria-describedby={fieldErrors?.email ? `${emailId}-error` : undefined}
					required
				/>
				{fieldErrors?.email && (
					<span id={`${emailId}-error`} className={styles.fieldError}>
						{fieldErrors.email}
					</span>
				)}
			</div>

			<div className={styles.field}>
				<label htmlFor={subjectId} className={styles.label}>
					{contactFormStrings.subjectLabel}
				</label>
				<input
					id={subjectId}
					name="subject"
					type="text"
					value={values.subject}
					onChange={handleTextChange}
					className={styles.input}
					placeholder={contactFormStrings.subjectPlaceholder}
					disabled={isPending}
				/>
			</div>

			<div className={styles.field}>
				<label htmlFor={messageId} className={styles.label}>
					{contactFormStrings.messageLabel}
				</label>
				<textarea
					id={messageId}
					name="message"
					value={values.message}
					onChange={handleTextChange}
					className={classNames(styles.textarea, { [styles.inputError]: Boolean(fieldErrors?.message) })}
					placeholder={contactFormStrings.messagePlaceholder}
					disabled={isPending}
					aria-invalid={Boolean(fieldErrors?.message)}
					aria-describedby={fieldErrors?.message ? `${messageId}-error` : undefined}
					required
				/>
				{fieldErrors?.message && (
					<span id={`${messageId}-error`} className={styles.fieldError}>
						{fieldErrors.message}
					</span>
				)}
			</div>

			<div className={styles.checkboxRow}>
				<input
					id={sendCopyId}
					name="sendCopy"
					type="checkbox"
					checked={values.sendCopy}
					onChange={handleCheckboxChange}
					className={styles.checkbox}
					disabled={isPending}
				/>
				<label htmlFor={sendCopyId} className={styles.checkboxLabel}>
					{contactFormStrings.sendCopyLabel}
				</label>
			</div>

			<input
				type="text"
				name="website"
				tabIndex={-1}
				autoComplete="off"
				className={styles.honeypot}
				aria-hidden="true"
			/>

			<button
				type="submit"
				className={styles.submit}
				disabled={isPending}
			>
				{isPending ? contactFormStrings.submitPending : contactFormStrings.submitIdle}
			</button>
		</form>
	);
};
