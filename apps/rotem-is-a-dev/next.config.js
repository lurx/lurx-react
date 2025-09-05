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
	transpilePackages: ['@lurx-react/vanguardis'],
	webpack: (config, { isServer }) => {
		// Handle SCSS imports and library resolution
		config.resolve.alias = {
			...config.resolve.alias,
			// Point to source for development and CMD+click navigation
			'@lurx-react/vanguardis/src': require('path').resolve(
				__dirname,
				'../../libs/vanguardis/src',
			),
			// Point style import to built CSS
			'@lurx-react/vanguardis/style': require('path').resolve(
				__dirname,
				'../../dist/libs/vanguardis/style.css',
			),
		};

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
