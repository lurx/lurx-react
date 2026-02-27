import type { InputHTMLAttributes } from 'react';

export interface TextInputProps
	extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
	label: string;
}
