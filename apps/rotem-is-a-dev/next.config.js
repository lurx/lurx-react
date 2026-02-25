//@ts-check

const { composePlugins, withNx } = require('@nx/next');

async function headers() {
	return [
		{
			source: '/(.*)',
			headers: [
				{
					key: 'Content-Security-Policy',
					value: [
						"default-src 'self'",
						"script-src 'self' 'unsafe-inline'",
						"style-src 'self' 'unsafe-inline'",
						"img-src 'self' data:",
						"font-src 'self'",
						"connect-src 'self'",
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
	nx: {
		// Set this to true if you would like to use SVGR
		// See: https://github.com/gregberge/svgr
		svgr: false,
	},
	headers,
	sassOptions: {
		includePaths: ['./src/styles'],
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
