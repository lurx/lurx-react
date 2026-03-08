//@ts-check

const { composePlugins, withNx } = require('@nx/next');

const isDev = process.env.NODE_ENV !== 'production';

const scriptSrc = [
	"'self'",
	"'unsafe-inline'",
	"'wasm-unsafe-eval'", // Shiki's WASM module needs 'wasm-unsafe-eval' in script-src to compile WebAssembly in the browser. This is a narrow permission that only allows WASM compilation, not JavaScript eval().
	isDev && "'unsafe-eval'",
]
	.filter(Boolean)
	.join(' ');

const connectSrc = [
	"'self'",
	isDev && 'ws:',
	'https://*.googleapis.com',
	'https://*.firebaseio.com',
	'https://*.cloudfunctions.net',
	'https://identitytoolkit.googleapis.com',
	'https://securetoken.googleapis.com',
	'https://firestore.googleapis.com',
]
	.filter(Boolean)
	.join(' ');

const imgSrc = [
	"'self'",
	'data:',
	'https://lh3.googleusercontent.com',
	'https://avatars.githubusercontent.com',
]
	.filter(Boolean)
	.join(' ');

const frameSrc = ['https://*.firebaseapp.com'].join(' ');

async function headers() {
	return [
		{
			source: '/(.*)',
			headers: [
				{
					key: 'Content-Security-Policy',
					value: [
						"default-src 'self'",
						`script-src ${scriptSrc}`,
						"style-src 'self' 'unsafe-inline'",
						`img-src ${imgSrc}`,
						"font-src 'self'",
						`connect-src ${connectSrc}`,
						`frame-src ${frameSrc}`,
						"frame-ancestors 'none'",
					].join('; '),
				},
				{ key: 'X-Content-Type-Options', value: 'nosniff' },
				{ key: 'X-Frame-Options', value: 'DENY' },
				{ key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
			],
		},
	];
}

/**
 * @type {import('@nx/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
	nx: {},
	headers,
	sassOptions: {
		includePaths: ['./src/styles'],
		silenceDeprecations: ['legacy-js-api'],
	},
	webpack: config => {
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

// Add SVGR webpack config function
// @ts-expect-error - SVGR plugin types not available
const withSvgr = config => {
	const originalWebpack = config.webpack;
	// @ts-expect-error - SVGR plugin types not available
	config.webpack = (webpackConfig, ctx) => {
		// Add SVGR support with webpack 5 asset modules
		webpackConfig.module.rules.push({
			test: /.svg$/,
			oneOf: [
				{
					resourceQuery: /url/,
					type: 'asset/resource',
					generator: {
						filename: 'static/media/[name].[hash][ext]',
					},
				},
				{
					issuer: { not: /.(css|scss|sass)$/ },
					resourceQuery: {
						not: [
							/__next_metadata__/,
							/__next_metadata_route__/,
							/__next_metadata_image_meta__/,
						],
					},
					use: [
						{
							loader: require.resolve('@svgr/webpack'),
							options: {
								svgo: false,
								titleProp: true,
								ref: true,
							},
						},
					],
				},
			],
		});
		return originalWebpack
			? originalWebpack(webpackConfig, ctx)
			: webpackConfig;
	};
	return config;
};

class VeliteWebpackPlugin {
	static started = false;
	apply(/** @type {any} */ compiler) {
		compiler.hooks.beforeCompile.tapPromise('VeliteWebpackPlugin', async () => {
			if (VeliteWebpackPlugin.started) return;
			VeliteWebpackPlugin.started = true;
			const dev = compiler.options.mode === 'development';
			const { build } = await import('velite');
			await build({ watch: dev, clean: !dev });
		});
	}
}

// @ts-expect-error - Velite webpack plugin types not available
const withVelite = config => {
	const originalWebpack = config.webpack;
	// @ts-expect-error - Velite webpack plugin types not available
	config.webpack = (webpackConfig, ctx) => {
		webpackConfig.plugins.push(new VeliteWebpackPlugin());
		return originalWebpack
			? originalWebpack(webpackConfig, ctx)
			: webpackConfig;
	};
	return config;
};

module.exports = composePlugins(...plugins, withSvgr, withVelite)(nextConfig);
