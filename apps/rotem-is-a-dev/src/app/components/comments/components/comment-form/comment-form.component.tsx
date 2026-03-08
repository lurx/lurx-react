'use client';

import { useActionState, useRef } from 'react';
import { MAX_COMMENT_LENGTH } from '../../comments.constants';
import { COMMENT_FORM_STRINGS } from './comment-form.constants';
import styles from './comment-form.module.scss';
import type { CommentFormProps } from './comment-form.types';

export const CommentForm = ({ onSubmit }: CommentFormProps) => {
	const formRef = useRef<HTMLFormElement>(null);

	const submitAction = async (_previousState: Nullable<string>, formData: FormData) => {
		const text = (formData.get('comment') as string).trim();
		if (text.length === 0) return null;

		try {
			await onSubmit(text);
			formRef.current?.reset();
		} catch {
			// Submission failed — form remains populated so user can retry
		}

		return null;
	};

	const [, action, isPending] = useActionState(submitAction, null);

	return (
		<form
			ref={formRef}
			className={styles.form}
			action={action}
			data-testid="comment-form"
		>
			<textarea
				name="comment"
				className={styles.textarea}
				placeholder={COMMENT_FORM_STRINGS.PLACEHOLDER}
				maxLength={MAX_COMMENT_LENGTH}
				rows={3}
				disabled={isPending}
				data-testid="comment-textarea"
			/>
			<button
				type="submit"
				className={styles.submitButton}
				disabled={isPending}
				data-testid="comment-submit"
			>
				{isPending ? COMMENT_FORM_STRINGS.SUBMITTING : COMMENT_FORM_STRINGS.SUBMIT}
			</button>
		</form>
	);
};
