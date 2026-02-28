import type { ShikiCodeProps } from './shiki-code.types';

export const ShikiCode = ({ lines }: ShikiCodeProps) => {
	return lines.map((line, lineIndex) => (
		<span key={`line-${lineIndex}-${JSON.stringify(line)}`}>
			{line.tokens.map((token, tokenIndex) => (
				<span
					key={`token-${lineIndex}-${tokenIndex}`}
					style={{ color: token.color }}
				>
					{token.content}
				</span>
			))}
			{'\n'}
		</span>
	));
};
