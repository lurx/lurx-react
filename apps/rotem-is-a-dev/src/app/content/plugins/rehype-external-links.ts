type HastNode = {
	type: string;
	tagName?: string;
	properties?: Record<string, unknown>;
	children?: HastNode[];
};

const EXTERNAL_ICON: HastNode = {
	type: 'element',
	tagName: 'span',
	properties: {
		className: ['external-link-icon'],
		ariaHidden: 'true',
	},
	children: [
		{
			type: 'element',
			tagName: 'svg',
			properties: {
				fill: 'currentColor',
				width: '10',
				height: '10',
				focusable: 'false',
				xmlns: 'http://www.w3.org/2000/svg',
				viewBox: '0 0 24 24',
			},
			children: [
				{
					type: 'element',
					tagName: 'path',
					properties: {
						// eslint-disable-next-line id-length -- SVG path data attribute
						d: 'M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z',
						transform: 'rotate(135 12 12)',
					},
					children: [],
				},
			],
		},
	],
};

export function rehypeExternalLinks() {
	return (tree: HastNode) => {
		visitLinks(tree);
	};
}

function cloneNode(node: HastNode): HastNode {
	return {
		...node,
		properties: { ...node.properties },
		children: (node.children ?? []).map(child => cloneNode(child)),
	};
}

function visitLinks(node: HastNode) {
	if (!node.children) return;

	for (const child of node.children) {
		if (child.type !== 'element') continue;

		if (child.tagName === 'a' && child.properties && child.children) {
			const href = child.properties.href;
			if (typeof href === 'string' && href.startsWith('http')) {
				child.properties['target'] = '_blank';
				child.properties['rel'] = 'noopener noreferrer';
				child.children.push(cloneNode(EXTERNAL_ICON));
			}
		}

		visitLinks(child);
	}
}
