//@ts-check

const { composePlugins, withNx } = require('@nx/next');

/**
 * @type {import('@nx/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
	nx: {
		svgr: false,
	},
	webpack(config, options) {
		if (!options.isServer) {
			// Give the remote its own chunk-loading global so it gets a separate webpack runtime
			// in the host's browser context with its own __webpack_require__.p (port 4201, not 4200)
			config.output.chunkLoadingGlobal = 'webpackChunk_wolverine_css';
			config.output.publicPath = 'http://localhost:4201/_next/';

			// @ts-expect-error webpack is available at runtime via Next.js but not declared as a direct dep
			const { ModuleFederationPlugin } = require('webpack').container;
			config.plugins.push(
				new ModuleFederationPlugin({
					name: 'wolverine_css',
					filename: 'static/chunks/remoteEntry.js',
					exposes: {
						'./WolverineDemo': './src/app/page.tsx',
					},
				}),
			);
		}
		return config;
	},
};

const plugins = [
	withNx,
];

module.exports = composePlugins(...plugins)(nextConfig);
