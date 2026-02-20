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
	sassOptions: {
		includePaths: ['./src/app/cv/styles'],
	},
	webpack: (config) => {
		// enforce: 'pre' makes this loader run before SWC, so it receives
		// the raw TypeScript source from disk, not the compiled JS output.
		config.module.rules.push({
			resourceQuery: /raw/,
			enforce: 'pre',
			use: [{ loader: require('path').resolve(__dirname, 'raw-loader.cjs') }],
		});
		return config;
	},
};

const plugins = [
	// Add more Next.js plugins to this list if needed.
	withNx,
];

module.exports = composePlugins(...plugins)(nextConfig);
