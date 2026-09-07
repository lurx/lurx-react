import type { ThemedToken } from 'shiki/core';
import type { CSSProperties } from 'react';
import type { ShikiLine, ShikiToken } from './shiki.types';

/**
 * With two themes requested, `htmlStyle` holds the `--shiki-light` /
 * `--shiki-dark` custom-property pair. It is typed as a plain record, so it is
 * copied onto a CSSProperties target rather than being handed over directly.
 */
function toToken(token: ThemedToken): ShikiToken {
	const style: CSSProperties = {};

	if (token.htmlStyle) {
		Object.assign(style, token.htmlStyle);
	}

	return { content: token.content, style };
}

export function toShikiLines(tokenLines: ThemedToken[][]): ShikiLine[] {
	return tokenLines.map(tokenLine => ({ tokens: tokenLine.map(toToken) }));
}
