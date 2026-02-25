//@ts-check

const { composePlugins, withNx } = require('@nx/next');

const isDev = process.env.NODE_ENV !== 'production';

const scriptSrc = [
  "'self'",
  "'unsafe-inline'",
  isDev && "'unsafe-eval'",
].filter(Boolean).join(' ');

const connextSrc = [
  "'self'",
  isDev && "ws:",
].filter(Boolean).join(' ');

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
	nx: {
		// Set this to true if you would like to use SVGR
		// See: https://github.com/gregberge/svgr
		svgr: true,
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
