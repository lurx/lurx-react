// React style objects legitimately carry CSS custom properties (shiki emits its
// per-token `--shiki-light` / `--shiki-dark` pair that way), but csstype only
// knows the standard properties. Widening it here keeps those assignments
// type-checked instead of asserted away at every call site.
import 'csstype';

declare module 'csstype' {
	interface Properties {
		[customProperty: `--${string}`]: string | number | undefined;
	}
}
