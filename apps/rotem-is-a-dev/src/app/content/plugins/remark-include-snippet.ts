import { readFileSync } from 'node:fs';
import { extname, resolve } from 'node:path';
import type { MdastNode, RemarkIncludeSnippetOptions } from './remark-include-snippet.types';

const INCLUDE_LANG = 'include';

const LANG_BY_EXTENSION: Record<string, string> = {
	'.ts': 'ts',
	'.tsx': 'tsx',
	'.js': 'js',
	'.jsx': 'jsx',
	'.json': 'json',
	'.scss': 'scss',
	'.css': 'css',
	'.md': 'md',
	'.mdx': 'mdx',
};

export function remarkIncludeSnippet(options: RemarkIncludeSnippetOptions) {
	return (tree: MdastNode) => {
		visitNode(tree, options.baseDir);
	};
}

function visitNode(node: MdastNode, baseDir: string) {
	if (!node.children) return;

	for (let index = 0; index < node.children.length; index++) {
		const child = node.children[index];

		if (isIncludeDirective(child)) {
			const filename = (child.value ?? '').trim();
			node.children[index] = buildCodeNode(filename, baseDir);
			continue;
		}

		visitNode(child, baseDir);
	}
}

function isIncludeDirective(node: MdastNode): boolean {
	return node.type === 'code' && node.lang === INCLUDE_LANG;
}

function buildCodeNode(filename: string, baseDir: string): MdastNode {
	const absolutePath = resolve(baseDir, filename);
	const contents = readFileSync(absolutePath, 'utf-8');
	const lang = LANG_BY_EXTENSION[extname(filename)] ?? 'text';

	return {
		type: 'code',
		lang,
		value: contents.replace(/\n+$/, ''),
	};
}
