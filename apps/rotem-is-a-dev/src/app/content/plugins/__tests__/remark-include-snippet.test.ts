import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { remarkIncludeSnippet } from '../remark-include-snippet';
import type { MdastNode } from '../remark-include-snippet.types';

function makeRoot(children: MdastNode[]): MdastNode {
	return { type: 'root', children };
}

function makeIncludeFence(filename: string): MdastNode {
	return { type: 'code', lang: 'include', value: filename };
}

describe('remarkIncludeSnippet', () => {
	let baseDir: string;

	beforeEach(() => {
		baseDir = mkdtempSync(join(tmpdir(), 'remark-include-snippet-'));
	});

	afterEach(() => {
		rmSync(baseDir, { recursive: true, force: true });
	});

	it('replaces an include code fence with a code node containing the file contents', () => {
		writeFileSync(join(baseDir, 'sample.snippet.ts'), 'export const answer = 42;\n');
		const tree = makeRoot([makeIncludeFence('sample.snippet.ts')]);

		remarkIncludeSnippet({ baseDir })(tree);

		expect(tree.children).toEqual([
			{ type: 'code', lang: 'ts', value: 'export const answer = 42;' },
		]);
	});

	it('infers the language from the file extension', () => {
		writeFileSync(join(baseDir, 'config.json'), '{"name":"sample"}');
		const tree = makeRoot([makeIncludeFence('config.json')]);

		remarkIncludeSnippet({ baseDir })(tree);

		expect((tree.children![0] as { lang: string }).lang).toBe('json');
	});

	it('falls back to text for unknown extensions', () => {
		writeFileSync(join(baseDir, 'notes.txt'), 'plain text');
		const tree = makeRoot([makeIncludeFence('notes.txt')]);

		remarkIncludeSnippet({ baseDir })(tree);

		expect((tree.children![0] as { lang: string }).lang).toBe('text');
	});

	it('trims surrounding whitespace from the filename', () => {
		writeFileSync(join(baseDir, 'spaced.ts'), 'export {};');
		const tree = makeRoot([makeIncludeFence('  spaced.ts  ')]);

		remarkIncludeSnippet({ baseDir })(tree);

		expect((tree.children![0] as { value: string }).value).toBe('export {};');
	});

	it('leaves non-include code fences alone', () => {
		const tsFence: MdastNode = { type: 'code', lang: 'ts', value: 'const x = 1;' };
		const tree = makeRoot([tsFence]);

		remarkIncludeSnippet({ baseDir })(tree);

		expect(tree.children).toEqual([tsFence]);
	});

	it('recurses into nested children', () => {
		writeFileSync(join(baseDir, 'nested.ts'), 'export {};');
		const tree = makeRoot([
			{ type: 'blockquote', children: [makeIncludeFence('nested.ts')] },
		]);

		remarkIncludeSnippet({ baseDir })(tree);

		const blockquoteChildren = (tree.children![0] as MdastNode).children;
		expect(blockquoteChildren).toEqual([
			{ type: 'code', lang: 'ts', value: 'export {};' },
		]);
	});
});
