import { ShikiTokens } from './components';
import type { ShikiCodeProps } from './shiki-code.types';

export const ShikiCode = ({ lines }: ShikiCodeProps) => {
	return lines.map((line, lineIndex) => (
		<span key={`line-${lineIndex}-${JSON.stringify(line)}`}>
			<ShikiTokens
				tokens={line.tokens}
				lineKey={String(lineIndex)}
			/>
			{'\n'}
		</span>
	));
};
