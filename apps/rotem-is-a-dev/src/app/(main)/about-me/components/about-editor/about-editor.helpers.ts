import type {
	AboutFileContent,
	JsdocFileContent,
	JsonFileContent,
	MarkdownFileContent,
} from '../../data/about-files.data';

const COMMENT_WRAP_WIDTH = 38;

export const wrapWords = (text: string, maxWidth: number): string[] => {
	const words = text.split(' ');
	const lines: string[] = [];
	let current = '';

	for (const word of words) {
		if (current === '') {
			current = word;
		} else if (current.length + 1 + word.length <= maxWidth) {
			current += ` ${word}`;
		} else {
			lines.push(current);
			current = word;
		}
	}

	if (current) lines.push(current);
	return lines;
};

export const toJsdocLines = ({ paragraphs }: JsdocFileContent): string[] => {
	const lines = ['/**'];

	paragraphs.forEach((paragraph, index) => {
		wrapWords(paragraph, COMMENT_WRAP_WIDTH).forEach(line =>
			lines.push(` * ${line}`),
		);
		if (index < paragraphs.length - 1) lines.push(' *');
	});

	lines.push(' *', ' */');
	return lines;
};

export const toJsonLines = ({ json }: JsonFileContent): string[] => {
	return JSON.stringify(json, null, 2).split('\n');
};

export const toMarkdownLines = ({ raw }: MarkdownFileContent): string[] => {
	return raw.split('\n');
};

export const toLines = (content: AboutFileContent): string[] => {
	if (content.format === 'json') {
		return toJsonLines(content);
	}
	if (content.format === 'markdown') {
		return toMarkdownLines(content);
	}
	return toJsdocLines(content);
};

export const toLanguage = (content: AboutFileContent): 'javascript' | 'json' | 'markdown' => {
	if (content.format === 'json') return 'json';
	if (content.format === 'markdown') return 'markdown';
	return 'javascript';
};
