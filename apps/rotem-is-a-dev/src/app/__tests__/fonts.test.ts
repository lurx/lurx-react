import { firaCode, inter, poppins } from '../fonts';

describe('Fonts Configuration', () => {
	describe('Inter Font', () => {
		it('should have correct configuration', () => {
			expect(inter.variable).toBe('--font-inter');
			expect(inter.style.fontFamily).toContain('Inter');
		});
	});

	describe('Poppins Font', () => {
		it('should have correct configuration', () => {
			expect(poppins.variable).toBe('--font-poppins');
			expect(poppins.style.fontFamily).toContain('Poppins');
		});
	});

	describe('Fira Code Font', () => {
		it('should have correct configuration', () => {
			expect(firaCode.variable).toBe('--font-fira-code');
			expect(firaCode.style.fontFamily).toContain('Fira Code');
		});
	});

	describe('Font Variables', () => {
		it('should export all required font variables', () => {
			expect(inter.variable).toBeDefined();
			expect(poppins.variable).toBeDefined();
			expect(firaCode.variable).toBeDefined();
		});

		it('should have unique variable names', () => {
			const variables = [inter.variable, poppins.variable, firaCode.variable];
			const uniqueVariables = new Set(variables);
			expect(uniqueVariables.size).toBe(variables.length);
		});
	});
});
