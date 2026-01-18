/**
 * Environment configuration for the processor microservice.
 * Provider-agnostic - works with Railway, Fly.io, Render, or any Docker host.
 */

export interface Config {
	port: number;
	/** API key for authenticating requests from the main app */
	apiKey: string;
	/** Allowed origins for CORS */
	allowedOrigins: string[];
	/** R2/S3 configuration */
	storage: {
		accountId: string;
		endpoint: string;
		bucket: string;
		accessKeyId: string;
		secretAccessKey: string;
	};
	/** Processing defaults */
	processing: {
		defaultSegmentDuration: number;
		outputFormat: 'mp4' | 'webm';
		quality: 'high' | 'medium' | 'low';
		/** Temp directory for processing files */
		tempDir: string;
	};
}

export function getConfig(): Config {
	const requiredEnvVars = [
		'R2_ACCOUNT_ID',
		'R2_ENDPOINT',
		'R2_BUCKET_NAME',
		'R2_ACCESS_KEY_ID',
		'R2_SECRET_ACCESS_KEY',
	];

	const missing = requiredEnvVars.filter((v) => !process.env[v]);
	if (missing.length > 0) {
		throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
	}

	// Parse allowed origins from comma-separated string
	const allowedOrigins = (process.env.ALLOWED_ORIGINS || '')
		.split(',')
		.map((o) => o.trim())
		.filter(Boolean);

	// Default to allowing localhost in development
	if (allowedOrigins.length === 0) {
		allowedOrigins.push('http://localhost:4200', 'http://localhost:3000');
	}

	return {
		port: parseInt(process.env.PORT || '3001', 10),
		apiKey: process.env.API_KEY || '',
		allowedOrigins,
		storage: {
			accountId: process.env.R2_ACCOUNT_ID!,
			endpoint: process.env.R2_ENDPOINT!,
			bucket: process.env.R2_BUCKET_NAME!,
			accessKeyId: process.env.R2_ACCESS_KEY_ID!,
			secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
		},
		processing: {
			defaultSegmentDuration: parseInt(process.env.DEFAULT_SEGMENT_DURATION || '59', 10),
			outputFormat: (process.env.OUTPUT_FORMAT || 'mp4') as 'mp4' | 'webm',
			quality: (process.env.PROCESSING_QUALITY || 'medium') as 'high' | 'medium' | 'low',
			tempDir: process.env.TEMP_DIR || '/tmp/story-wise',
		},
	};
}
