import styles from './shiki-tokens.module.scss';
import type { ShikiTokensProps } from './shiki-tokens.types';

export const ShikiTokens = ({ tokens, lineKey }: ShikiTokensProps) => {
	return tokens.map((token, tokenIndex) => (
		<span
			key={`token-${lineKey}-${tokenIndex}`}
			className={styles.token}
			style={token.style}
		>
			{token.content}
		</span>
	));
};
