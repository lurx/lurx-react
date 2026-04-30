/**
 * Rehype plugin that fixes `<br>` elements inside mermaid SVG foreignObject.
 *
 * When hast-util-to-html serializes a `<br>` inside an SVG context, it uses
 * XML rules and produces `<br></br>`. Browsers interpret `</br>` as a second
 * line break, doubling every line break in mermaid node labels.
 *
 * This plugin replaces `<br>` elements inside `<foreignObject>` with
 * `<span style="display:block">` which produces the same visual line break
 * without relying on an HTML void element inside SVG serialization.
 */

type HastNode = {
	type: string;
	tagName?: string;
	value?: string;
	properties?: Record<string, unknown>;
	children?: HastNode[];
};

export function rehypeMermaidBrFix() {
	return (tree: HastNode) => {
		visitSvg(tree);
	};
}

function visitSvg(node: HastNode) {
	if (!node.children) return;

	for (const child of node.children) {
		if (child.type === 'element' && child.tagName === 'foreignObject') {
			fixBrElements(child);
		} else {
			visitSvg(child);
		}
	}
}

function fixBrElements(node: HastNode) {
	if (!node.children) return;

	for (let index = 0; index < node.children.length; index++) {
		const child = node.children[index];

		if (child.type === 'element' && child.tagName === 'br') {
			node.children[index] = {
				type: 'element',
				tagName: 'span',
				properties: { style: 'display:block' },
				children: [],
			};
		} else {
			fixBrElements(child);
		}
	}
}
