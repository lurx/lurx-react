//@ts-check

const { composePlugins, withNx } = require('@nx/next');

/**
 * @type {import('@nx/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
	nx: {
		// Set this to true if you would like to use SVGR
		// See: https://github.com/gregberge/svgr
		svgr: false,
	},

	// Transpile video-processing library
	transpilePackages: ['@lurx-react/video-processing'],

	// Required headers for FFmpeg.wasm SharedArrayBuffer support
	async headers() {
		return [
			{
				source: '/:path*',
				headers: [
					{
						key: 'Cross-Origin-Opener-Policy',
						value: 'same-origin',
					},
					{
						key: 'Cross-Origin-Embedder-Policy',
						value: 'require-corp',
					},
				],
			},
		];
	},

	// Webpack configuration for library resolution
	webpack: (config) => {
		// Ensure proper module resolution for the library
		config.resolve.extensionAlias = {
			...config.resolve.extensionAlias,
			'.js': ['.js', '.ts', '.tsx'],
			'.mjs': ['.mjs', '.js', '.ts', '.tsx'],
		};

		return config;
	},
};

const plugins = [
	// Add more Next.js plugins to this list if needed.
	withNx,
];

module.exports = composePlugins(...plugins)(nextConfig);
