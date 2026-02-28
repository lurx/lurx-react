export type CodeBlockProps = {
	code: string;
	language?: 'typescript' | 'javascript' | 'json';
	className?: string;
	numberOfLines?: number;
	'aria-label'?: string;
}

export type ServerCodeBlockProps = {
	code: string;
	language?: 'typescript' | 'javascript' | 'json';
	className?: string;
	numberOfLines?: number;
	'aria-label'?: string;
}
