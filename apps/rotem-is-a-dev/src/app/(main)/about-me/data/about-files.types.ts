export type SectionId = 'personal-info' | 'work-experience';

export type AboutFileId =
	| 'bio'
	| 'interests'
	| 'payoneer'
	| 'startup-booster'
	| 'investing-com'
	| 'isocia';

export type JsdocFileContent = {
	title: string;
	format: 'jsdoc';
	paragraphs: string[];
}

export type JsonFileContent = {
	title: string;
	format: 'json';
	json: Record<string, unknown>;
}

export type MarkdownFileContent = {
	title: string;
	format: 'markdown';
	raw: string;
}

export type AboutFileContent = JsdocFileContent | JsonFileContent | MarkdownFileContent;

export type SectionConfig = {
	id: SectionId;
	label: string;
	icon: string;
}
