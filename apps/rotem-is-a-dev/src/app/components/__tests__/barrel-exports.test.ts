import { CodeBlock, FaIcon, Flex, Link } from '../index';

describe('Component barrel exports', () => {
	it('re-exports all shared components', () => {
		expect(CodeBlock).toBeDefined();
		expect(FaIcon).toBeDefined();
		expect(Flex).toBeDefined();
		expect(Link).toBeDefined();
	});
});
