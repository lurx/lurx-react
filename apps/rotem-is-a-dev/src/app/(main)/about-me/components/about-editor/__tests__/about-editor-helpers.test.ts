import {
	wrapWords,
	toJsdocLines,
	toJsonLines,
	toMarkdownLines,
	toLines,
	toLanguage,
} from '../about-editor.helpers';
import type { JsdocFileContent, JsonFileContent, MarkdownFileContent } from '../../../data/about-files.data';

describe('about-editor.helpers', () => {
	describe('wrapWords', () => {
		it('returns the full text as a single line when it fits within maxWidth', () => {
			expect(wrapWords('hello world', 20)).toEqual(['hello world']);
		});

		it('returns a single line when text length equals maxWidth exactly', () => {
			expect(wrapWords('hello world', 11)).toEqual(['hello world']);
		});

		it('wraps text that exceeds maxWidth onto multiple lines', () => {
			const result = wrapWords('one two three four five', 10);
			expect(result).toEqual(['one two', 'three four', 'five']);
		});

		it('returns the single word as a single-element array', () => {
			expect(wrapWords('word', 10)).toEqual(['word']);
		});

		it('returns an empty array for an empty string', () => {
			expect(wrapWords('', 20)).toEqual([]);
		});

		it('does not split a word that alone exceeds maxWidth', () => {
			// cspell:disable-next-line
			expect(wrapWords('superlongword', 5)).toEqual(['superlongword']);
		});

		it('wraps correctly when a word addition would exceed maxWidth by one character', () => {
			// 'abc def' is 7 chars; maxWidth is 6 so 'def' must go to a new line
			expect(wrapWords('abc def', 6)).toEqual(['abc', 'def']);
		});
	});

	describe('toJsdocLines', () => {
		it('wraps a single paragraph with opening and closing comment markers', () => {
			const content: JsdocFileContent = {
				title: 'test',
				format: 'jsdoc',
				paragraphs: ['Short text.'],
			};
			const lines = toJsdocLines(content);
			expect(lines[0]).toBe('/**');
			expect(lines.at(-1)).toBe(' */');
			expect(lines.at(-2)).toBe(' *');
		});

		it('includes the paragraph text prefixed with " * "', () => {
			const content: JsdocFileContent = {
				title: 'test',
				format: 'jsdoc',
				paragraphs: ['Hello world.'],
			};
			const lines = toJsdocLines(content);
			expect(lines).toContain(' * Hello world.');
		});

		it('inserts a blank " *" separator line between multiple paragraphs', () => {
			const content: JsdocFileContent = {
				title: 'test',
				format: 'jsdoc',
				paragraphs: ['First paragraph.', 'Second paragraph.'],
			};
			const lines = toJsdocLines(content);
			const firstLineIndex = lines.indexOf(' * First paragraph.');
			const separatorIndex = lines.indexOf(' *', firstLineIndex + 1);
			const secondLineIndex = lines.indexOf(' * Second paragraph.');
			expect(separatorIndex).toBeGreaterThan(firstLineIndex);
			expect(secondLineIndex).toBeGreaterThan(separatorIndex);
		});

		it('does not insert a separator line after the last paragraph', () => {
			const content: JsdocFileContent = {
				title: 'test',
				format: 'jsdoc',
				paragraphs: ['Only paragraph.'],
			};
			const lines = toJsdocLines(content);
			// The only ' *' entries should be the trailing ones added unconditionally
			const separatorCount = lines.filter(line => line === ' *').length;
			expect(separatorCount).toBe(1);
		});

		it('wraps a long paragraph across multiple " * " prefixed lines', () => {
			const content: JsdocFileContent = {
				title: 'test',
				format: 'jsdoc',
				paragraphs: [
					'This is a sufficiently long paragraph that will exceed the thirty eight character wrap width',
				],
			};
			const lines = toJsdocLines(content);
			const contentLines = lines.filter(
				line => line.startsWith(' * ') && line !== ' * ',
			);
			expect(contentLines.length).toBeGreaterThan(1);
		});

		it('produces correct structure for two paragraphs', () => {
			const content: JsdocFileContent = {
				title: 'test',
				format: 'jsdoc',
				paragraphs: ['Alpha.', 'Beta.'],
			};
			const lines = toJsdocLines(content);
			expect(lines[0]).toBe('/**');
			expect(lines[1]).toBe(' * Alpha.');
			expect(lines[2]).toBe(' *');
			expect(lines[3]).toBe(' * Beta.');
			expect(lines[4]).toBe(' *');
			expect(lines[5]).toBe(' */');
		});
	});

	describe('toJsonLines', () => {
		it('formats a simple flat object into JSON lines', () => {
			const content: JsonFileContent = {
				title: 'test',
				format: 'json',
				json: { name: 'Alice', age: 30 },
			};
			const lines = toJsonLines(content);
			expect(lines).toEqual([
				'{',
				'  "name": "Alice",',
				'  "age": 30',
				'}',
			]);
		});

		it('formats a nested object into JSON lines', () => {
			const content: JsonFileContent = {
				title: 'test',
				format: 'json',
				json: { person: { name: 'Bob' } },
			};
			const lines = toJsonLines(content);
			expect(lines).toEqual([
				'{',
				'  "person": {',
				'    "name": "Bob"',
				'  }',
				'}',
			]);
		});

		it('returns a multi-line array split on newlines', () => {
			const content: JsonFileContent = {
				title: 'test',
				format: 'json',
				json: { key1: 1, key2: 2 },
			};
			const lines = toJsonLines(content);
			expect(lines.length).toBeGreaterThan(1);
		});
	});

	describe('toMarkdownLines', () => {
		it('splits raw markdown into lines', () => {
			const content: MarkdownFileContent = {
				title: 'test',
				format: 'markdown',
				raw: '# Title\n\nSome text.',
			};
			expect(toMarkdownLines(content)).toEqual(['# Title', '', 'Some text.']);
		});

		it('returns a single-element array for a single line', () => {
			const content: MarkdownFileContent = {
				title: 'test',
				format: 'markdown',
				raw: 'One line only.',
			};
			expect(toMarkdownLines(content)).toEqual(['One line only.']);
		});
	});

	describe('toLines', () => {
		it('delegates to toJsonLines when format is "json"', () => {
			const content: JsonFileContent = {
				title: 'test',
				format: 'json',
				json: { key: 'value' },
			};
			const lines = toLines(content);
			expect(lines).toEqual(toJsonLines(content));
		});

		it('delegates to toJsdocLines when format is "jsdoc"', () => {
			const content: JsdocFileContent = {
				title: 'test',
				format: 'jsdoc',
				paragraphs: ['Some text.'],
			};
			const lines = toLines(content);
			expect(lines).toEqual(toJsdocLines(content));
		});

		it('returns lines starting with "/**" for jsdoc format', () => {
			const content: JsdocFileContent = {
				title: 'test',
				format: 'jsdoc',
				paragraphs: ['Text.'],
			};
			expect(toLines(content)[0]).toBe('/**');
		});

		it('returns lines starting with "{" for json format', () => {
			const content: JsonFileContent = {
				title: 'test',
				format: 'json',
				json: { x: 1 },
			};
			expect(toLines(content)[0]).toBe('{');
		});

		it('delegates to toMarkdownLines when format is "markdown"', () => {
			const content: MarkdownFileContent = {
				title: 'test',
				format: 'markdown',
				raw: '# Hello\n\nWorld.',
			};
			const lines = toLines(content);
			expect(lines).toEqual(toMarkdownLines(content));
		});
	});

	describe('toLanguage', () => {
		it('returns "json" for json format', () => {
			const content: JsonFileContent = {
				title: 'test',
				format: 'json',
				json: {},
			};
			expect(toLanguage(content)).toBe('json');
		});

		it('returns "javascript" for jsdoc format', () => {
			const content: JsdocFileContent = {
				title: 'test',
				format: 'jsdoc',
				paragraphs: [],
			};
			expect(toLanguage(content)).toBe('javascript');
		});

		it('returns "markdown" for markdown format', () => {
			const content: MarkdownFileContent = {
				title: 'test',
				format: 'markdown',
				raw: '# Hello',
			};
			expect(toLanguage(content)).toBe('markdown');
		});
	});
});
