export type RemarkIncludeSnippetOptions = {
	baseDir: string;
};

export type MdastNode = {
	type: string;
	value?: string;
	lang?: string;
	meta?: string;
	children?: MdastNode[];
};
