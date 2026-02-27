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

const connextSrc = ["'self'", isDev && 'ws:'].filter(Boolean).join(' ');

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
						"img-src 'self' data:",
						"font-src 'self'",
						`connect-src ${connextSrc}`,
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

module.exports = composePlugins(...plugins, withSvgr)(nextConfig);
