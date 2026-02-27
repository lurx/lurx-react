const config = {
	displayName: 'rotem-is-a-dev',
	preset: '../../jest.preset.js',
	setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
	testEnvironment: 'jsdom',
	testMatch: [
		'<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}',
		'<rootDir>/src/**/*.{test,spec}.{js,jsx,ts,tsx}',
	],
	transform: {
		'^(?!.*\\.(js|jsx|ts|tsx|css|json)$)': '@nx/react/plugins/jest',
		'^.+\\.[tj]sx?$': [
			'babel-jest',
			{ presets: [['@nx/next/babel', { 'preset-react': { runtime: 'automatic' } }]] },
		],
	},
	moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
	moduleNameMapper: {
		'^@/(.*)\\.ts\\?raw$': '<rootDir>/src/__mocks__/raw-file.js',
		'^@/(.*)$': '<rootDir>/src/$1',
		'\\.(css|less|scss|sass)$': 'identity-obj-proxy',
		'\\?raw$': '<rootDir>/src/__mocks__/raw-file.js',
	},
	coveragePathIgnorePatterns: [
		'/node_modules/',
		'/__tests__/',
		'/__mocks__/',
		'/index\\.ts$',
		'\\.svg$',
	],
	coverageDirectory: '../../coverage/apps/rotem-is-a-dev',
};

export default config;
