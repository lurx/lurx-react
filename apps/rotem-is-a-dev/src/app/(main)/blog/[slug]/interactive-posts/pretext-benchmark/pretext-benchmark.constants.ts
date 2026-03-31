import type { DecisionRow, ImpossibleThing, ScenarioCard } from './pretext-benchmark.types';

export const SCENARIOS = [
	{
		id: 'virtual',
		icon: { iconName: 'scroll', iconGroup: 'fal' },
		title: 'Virtualised Lists',
		description: 'Variable-height rows without measuring every DOM element',
	},
	{
		id: 'shrinkwrap',
		icon: { iconName: 'messages', iconGroup: 'fal' },
		title: 'Chat Bubbles',
		description: 'Exact shrinkwrap \u2014 CSS fit-content sizes to the widest line',
	},
	{
		id: 'masonry',
		icon: { iconName: 'objects-column', iconGroup: 'fal' },
		title: 'Masonry Layout',
		description: 'Assign cards to columns without DOM mounting',
	},
	{
		id: 'justification',
		icon: { iconName: 'text', iconGroup: 'fal' },
		title: 'Typography',
		description: 'Balanced justification, rivers, even line lengths',
	},
] satisfies ScenarioCard[];

export const DECISION_ROWS = [
	{ scenario: 'Virtual scroll, 100+ variable-height rows', verdict: 'yes', notes: 'Core use case. Prepare on data load, layout on resize.' },
	{ scenario: 'Chat bubbles with shrinkwrap', verdict: 'yes', notes: 'CSS cannot do this. walkLineRanges() + binary search.' },
	{ scenario: 'Canvas / WebGL text rendering', verdict: 'yes', notes: 'layoutWithLines() gives exact line positions for fillText().' },
	{ scenario: 'Masonry layout (text cards only)', verdict: 'yes', notes: 'Height prediction before mount. Images still need size data.' },
	{ scenario: 'Editorial / balanced justification', verdict: 'maybe', notes: 'layoutNextLine() and layoutWithLines() enable per-line-width algorithms, but Canvas/SVG-rendered text is invisible to screen readers. Extra effort to maintain an accessible DOM fallback may not be worth it.' },
	{ scenario: 'Accordion / expand-collapse animations', verdict: 'maybe', notes: 'Works, but CSS height: auto + transition usually suffices.' },
	{ scenario: 'Scroll position anchoring on new content', verdict: 'maybe', notes: 'Useful if you need height before insertion. CSS overflow-anchor also helps.' },
	{ scenario: 'Standard text in a fixed-width container', verdict: 'no', notes: 'Let the browser lay it out. No reason to override.' },
	{ scenario: 'Rich text (mixed fonts/weights inline)', verdict: 'maybe', notes: 'Core API is single-font, but per-span measurement via layoutNextLine() is possible (see rich-note demo). Non-trivial.' },
	{ scenario: 'CSS Grid / Flexbox sizing', verdict: 'no', notes: 'Browser layout engine handles this better than any JS.' },
	{ scenario: 'Multilingual app with Arabic/Myanmar/Thai', verdict: 'maybe', notes: 'Library has known edge cases in fine sweeps. Validate your specific content.' },
] satisfies DecisionRow[];

export const IMPOSSIBLE_THINGS = [
	{ icon: { iconName: 'arrows-left-right', iconGroup: 'fal' }, label: 'MULTILINE SHRINKWRAP', description: 'The tightest container that still wraps to N lines. No CSS property exists for this.' },
	{ icon: { iconName: 'person-digging', iconGroup: 'fal' }, label: 'WORKER-SIDE LAYOUT', description: 'Compute heights off the main thread. DOM measurement requires the UI thread.' },
	{ icon: { iconName: 'paintbrush-fine', iconGroup: 'fal' }, label: 'CANVAS / SVG TEXT', description: 'Route wrapped text to Canvas or SVG with exact line positions. CSS layout doesn\'t exist there.' },
	{ icon: { iconName: 'road-barrier', iconGroup: 'fal' }, label: 'OBSTACLE ROUTING', description: 'Flow text around images with per-line width changes. CSS shape-outside is limited; JS shapes aren\'t.' },
	{ icon: { iconName: 'scale-balanced', iconGroup: 'fal' }, label: 'BALANCED TEXT', description: 'Find the width where lines are most balanced (headline widows). CSS text-wrap: balance approximates this.' },
	{ icon: { iconName: 'vial', iconGroup: 'fal' }, label: 'BUILD-TIME CHECKS', description: 'Verify that button labels don\'t overflow their containers in CI \u2014 no browser required.' },
] satisfies ImpossibleThing[];
