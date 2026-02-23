import { toCodeLike } from '../to-code-like.util';

describe('toCodeLike', () => {
	describe('default options (lowercase)', () => {
		it('converts a simple string to lowercase', () => {
			expect(toCodeLike('Hello World')).toBe('hello world');
		});

		it('handles already lowercase strings', () => {
			expect(toCodeLike('hello')).toBe('hello');
		});
	});

	describe('uppercase', () => {
		it('converts to uppercase', () => {
			expect(toCodeLike('hello world', { convertCase: 'uppercase' })).toBe('HELLO WORLD');
		});
	});

	describe('camelCase', () => {
		it('converts a multi-word string to camelCase', () => {
			expect(toCodeLike('hello world', { convertCase: 'camelCase' })).toBe('helloWorld');
		});

		it('handles hyphenated input', () => {
			expect(toCodeLike('my-component', { convertCase: 'camelCase' })).toBe('myComponent');
		});

		it('handles underscored input', () => {
			expect(toCodeLike('my_variable', { convertCase: 'camelCase' })).toBe('myVariable');
		});
	});

	describe('snake_case', () => {
		it('converts spaces to underscores', () => {
			expect(toCodeLike('hello world', { convertCase: 'snake_case' })).toBe('hello_world');
		});

		it('handles hyphens', () => {
			expect(toCodeLike('my-component', { convertCase: 'snake_case' })).toBe('my_component');
		});
	});

	describe('kebab-case', () => {
		it('converts spaces to hyphens', () => {
			expect(toCodeLike('hello world', { convertCase: 'kebab-case' })).toBe('hello-world');
		});

		it('handles underscores', () => {
			expect(toCodeLike('my_variable', { convertCase: 'kebab-case' })).toBe('my-variable');
		});
	});

	describe('comment', () => {
		it('prefixes with // comment syntax', () => {
			expect(toCodeLike('todo fix later', { convertCase: 'comment' })).toBe('// todo fix later');
		});
	});

	describe('prefix', () => {
		it('adds a prefix to the output', () => {
			expect(toCodeLike('hello', { prefix: '_' })).toBe('_hello');
		});

		it('works with prefix and convertCase together', () => {
			expect(toCodeLike('Hello World', { prefix: '$', convertCase: 'camelCase' })).toBe('$helloWorld');
		});
	});

	describe('edge cases', () => {
		it('handles empty string', () => {
			expect(toCodeLike('')).toBe('');
		});

		it('trims and normalizes whitespace', () => {
			expect(toCodeLike('  hello   world  ')).toBe('hello world');
		});

		it('handles undefined convertCase (returns original string)', () => {
			expect(toCodeLike('Hello', { convertCase: undefined })).toBe('Hello');
		});

		it('returns original string for unsupported convertCase', () => {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const result = toCodeLike('Hello', { convertCase: 'UNKNOWN' as any });
			expect(result).toBe('Hello');
		});
	});
});
