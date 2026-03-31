import type { DecisionRow, ScenarioCard } from './pretext-benchmark.types';

export const SCENARIOS = [
	{
		id: 'virtual',
		icon: '\u{1F4DC}',
		title: 'Virtualised Lists',
		description: 'Variable-height rows without measuring every DOM element',
	},
	{
		id: 'shrinkwrap',
		icon: '\u{1F4AC}',
		title: 'Chat Bubbles',
		description: 'Exact shrinkwrap \u2014 CSS fit-content sizes to the widest line',
	},
	{
		id: 'masonry',
		icon: '\u{1F9F1}',
		title: 'Masonry Layout',
		description: 'Assign cards to columns without DOM mounting',
	},
	{
		id: 'justification',
		icon: '\u2302',
		title: 'Typography',
		description: 'Balanced justification, rivers, even line lengths',
	},
] satisfies ScenarioCard[];

export const DECISION_ROWS = [
	{ scenario: 'Virtual scroll, 100+ variable-height rows', verdict: 'yes', notes: 'Core use case. Prepare on data load, layout on resize.' },
	{ scenario: 'Chat bubbles with shrinkwrap', verdict: 'yes', notes: 'CSS cannot do this. walkLineRanges() + binary search.' },
	{ scenario: 'Canvas / WebGL text rendering', verdict: 'yes', notes: 'layoutWithLines() gives exact line positions for fillText().' },
	{ scenario: 'Masonry layout (text cards only)', verdict: 'yes', notes: 'Height prediction before mount. Images still need size data.' },
	{ scenario: 'Editorial / balanced justification', verdict: 'yes', notes: 'layoutNextLine() and layoutWithLines() enable per-line-width algorithms.' },
	{ scenario: 'Accordion / expand-collapse animations', verdict: 'maybe', notes: 'Works, but CSS height: auto + transition usually suffices.' },
	{ scenario: 'Scroll position anchoring on new content', verdict: 'maybe', notes: 'Useful if you need height before insertion. CSS overflow-anchor also helps.' },
	{ scenario: 'Standard text in a fixed-width container', verdict: 'no', notes: 'Let the browser lay it out. No reason to override.' },
	{ scenario: 'Rich text (mixed fonts/weights inline)', verdict: 'maybe', notes: 'Core API is single-font, but per-span measurement via layoutNextLine() is possible (see rich-note demo). Non-trivial.' },
	{ scenario: 'CSS Grid / Flexbox sizing', verdict: 'no', notes: 'Browser layout engine handles this better than any JS.' },
	{ scenario: 'Multilingual app with Arabic/Myanmar/Thai', verdict: 'maybe', notes: 'Library has known edge cases in fine sweeps. Validate your specific content.' },
] satisfies DecisionRow[];

export const IMPOSSIBLE_THINGS = [
	{ icon: '\u21D4', label: 'MULTILINE SHRINKWRAP', description: 'The tightest container that still wraps to N lines. No CSS property exists for this.' },
	{ icon: '\u{1F3C3}', label: 'WORKER-SIDE LAYOUT', description: 'Compute heights off the main thread. DOM measurement requires the UI thread.' },
	{ icon: '\u{1F58C}\uFE0F', label: 'CANVAS / SVG TEXT', description: 'Route wrapped text to Canvas or SVG with exact line positions. CSS layout doesn\'t exist there.' },
	{ icon: '\u{1F6A7}', label: 'OBSTACLE ROUTING', description: 'Flow text around images with per-line width changes. CSS shape-outside is limited; JS shapes aren\'t.' },
	{ icon: '\u2696\uFE0F', label: 'BALANCED TEXT', description: 'Find the width where lines are most balanced (headline widows). CSS text-wrap: balance approximates this.' },
	{ icon: '\u{1F9EA}', label: 'BUILD-TIME CHECKS', description: 'Verify that button labels don\'t overflow their containers in CI \u2014 no browser required.' },
];
