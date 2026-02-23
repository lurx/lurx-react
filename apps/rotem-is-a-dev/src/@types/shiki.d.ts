// Shiki uses package.json "exports" for subpath imports.
// TypeScript with moduleResolution: "node" can't resolve them,
// so we declare the modules manually.

declare module 'shiki/core' {
	export * from 'shiki';
}

declare module 'shiki/engine/oniguruma' {
	export function createOnigurumaEngine(
		wasmModule: Promise<unknown>,
	): import('shiki').RegexEngine;
}

declare module 'shiki/themes/night-owl' {
	const theme: import('shiki').ThemeRegistrationRaw;
	export default theme;
}

declare module 'shiki/langs/javascript' {
	const lang: import('shiki').LanguageRegistration;
	export default lang;
}

declare module 'shiki/langs/typescript' {
	const lang: import('shiki').LanguageRegistration;
	export default lang;
}

declare module 'shiki/langs/json' {
	const lang: import('shiki').LanguageRegistration;
	export default lang;
}

declare module 'shiki/wasm' {
	const wasm: unknown;
	export default wasm;
}
