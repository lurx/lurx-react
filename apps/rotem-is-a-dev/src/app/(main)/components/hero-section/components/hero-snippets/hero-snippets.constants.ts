import chunkRaw from '@/snippets/chunk.snippet.ts?raw';
import debounceRaw from '@/snippets/debounce.snippet.ts?raw';
import deepCloneRaw from '@/snippets/deep-clone.snippet.ts?raw';
import flattenRaw from '@/snippets/flatten.snippet.ts?raw';
import groupByRaw from '@/snippets/group-by.snippet.ts?raw';
import memoizeRaw from '@/snippets/memoize.snippet.ts?raw';
import throttleRaw from '@/snippets/throttle.snippet.ts?raw';

export const SNIPPETS = [
	{ title: 'debounce', code: debounceRaw },
	{ title: 'throttle', code: throttleRaw },
	{ title: 'deep-clone', code: deepCloneRaw },
	{ title: 'flatten', code: flattenRaw },
	{ title: 'group-by', code: groupByRaw },
	{ title: 'memoize', code: memoizeRaw },
	{ title: 'chunk', code: chunkRaw },
] as const;

export const TOTAL_SNIPPETS = SNIPPETS.length;
