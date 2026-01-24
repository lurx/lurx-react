export default {
	displayName: 'story-wise',
	preset: '../../jest.preset.js',
	setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
	testEnvironment: 'jsdom',
	transform: {
		'^(?!.*\\.(js|jsx|ts|tsx|css|json)$)': '@nx/react/plugins/jest',
		'^.+\\.[tj]sx?$': ['babel-jest', { presets: ['@nx/react/babel'] }],
	},
	moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
	moduleNameMapper: {
		'\\.(css|less|scss|sass)$': 'identity-obj-proxy',
		'^next/navigation$': '<rootDir>/__mocks__/next-navigation.ts',
		'^next/link$': '<rootDir>/__mocks__/next-link.tsx',
		'^@ffmpeg/ffmpeg$': '<rootDir>/__mocks__/ffmpeg-ffmpeg.ts',
		'^@ffmpeg/util$': '<rootDir>/__mocks__/ffmpeg-util.ts',
	},
	coverageDirectory: '../../coverage/apps/story-wise',
	testPathIgnorePatterns: ['/node_modules/', '/.next/'],
};
