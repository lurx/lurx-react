const { FlatCompat } = require('@eslint/eslintrc');
const js = require('@eslint/js');
const { fixupConfigRules } = require('@eslint/compat');
const nx = require('@nx/eslint-plugin');
const baseConfig = require('../../eslint.config.cjs');

const compat = new FlatCompat({
	baseDirectory: __dirname,
	recommendedConfig: js.configs.recommended,
});

module.exports = [
	{
		ignores: ['.next/**/*'],
	},
	...fixupConfigRules(compat.extends('next')),

	...fixupConfigRules(compat.extends('next/core-web-vitals')),

	...baseConfig,
	...nx.configs['flat/react-typescript'],
	{
		files: ['**/next-env.d.ts'],
		rules: {
			'@typescript-eslint/triple-slash-reference': 'off',
		},
	},
];
