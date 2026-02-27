const config = {
	displayName: 'wolverine-css',
	preset: '../../jest.preset.js',
	transform: {
		'^(?!.*\\.(js|jsx|ts|tsx|css|json)$)': '@nx/react/plugins/jest',
		'^.+\\.[tj]sx?$': [
			'babel-jest',
			{ presets: [['@nx/next/babel', { 'preset-react': { runtime: 'automatic' } }]] },
		],
	},
	moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
	coverageDirectory: '../../coverage/apps/wolverine-css',
	setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
};

export default config;
