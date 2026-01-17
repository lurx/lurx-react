/**
 * Cloud configuration for video processing
 *
 * This file manages cloud storage and processing settings.
 * Sensitive values should be set via environment variables.
 *
 * NOTE: Cloud processing is DISABLED by default. The app uses client-side
 * FFmpeg.wasm for video processing, which works everywhere (including Vercel).
 * Cloud processing via R2 is optional and requires server-side FFmpeg,
 * which is not available on Vercel serverless functions.
 *
 * To enable cloud processing (for self-hosted deployments with FFmpeg):
 *   CLOUD_PROCESSING_ENABLED=true
 */

export interface CloudConfig {
	/** Whether cloud processing is enabled */
	enabled: boolean;
	/** Cloud storage provider */
	provider: 'r2' | 's3' | 'local';
	/** R2/S3 configuration */
	storage: {
		/** Account ID (for R2) or region (for S3) */
		accountId?: string;
		/** Endpoint URL */
		endpoint?: string;
		/** Bucket name */
		bucket: string;
		/** Public URL prefix for accessing files (if using custom domain) */
		publicUrl?: string;
		/** Whether to use path-style URLs (required for some R2 setups) */
		forcePathStyle?: boolean;
	};
	/** Processing configuration */
	processing: {
		/** Maximum file size in bytes (default: 2GB) */
		maxFileSize: number;
		/** Default segment duration in seconds */
		defaultSegmentDuration: number;
		/** Output format */
		outputFormat: 'mp4' | 'webm';
		/** Quality preset */
		quality: 'high' | 'medium' | 'low';
		/** Whether to generate thumbnails */
		generateThumbnails: boolean;
		/** Signed URL expiration time in seconds (default: 1 hour) */
		signedUrlExpiration: number;
	};
	/** Cleanup configuration */
	cleanup: {
		/** Automatically delete files after this many days (0 = never) */
		deleteAfterDays: number;
		/** Run cleanup job interval in hours */
		cleanupIntervalHours: number;
	};
}

/**
 * Get cloud configuration from environment variables
 */
export function getCloudConfig(): CloudConfig {
	const isEnabled = process.env.CLOUD_PROCESSING_ENABLED === 'true';
	const provider = (process.env.CLOUD_STORAGE_PROVIDER || 'r2') as 'r2' | 's3' | 'local';

	return {
		enabled: isEnabled,
		provider,
		storage: {
			accountId: process.env.R2_ACCOUNT_ID || process.env.AWS_REGION,
			endpoint: process.env.R2_ENDPOINT || process.env.AWS_ENDPOINT,
			bucket: process.env.R2_BUCKET_NAME || process.env.AWS_S3_BUCKET || 'story-wise-videos',
			publicUrl: process.env.R2_PUBLIC_URL,
			forcePathStyle: process.env.R2_FORCE_PATH_STYLE === 'true',
		},
		processing: {
			maxFileSize: Number.parseInt(process.env.MAX_FILE_SIZE || '2147483648', 10), // 2GB default
			defaultSegmentDuration: Number.parseInt(process.env.DEFAULT_SEGMENT_DURATION || '59', 10),
			outputFormat: (process.env.OUTPUT_FORMAT || 'mp4') as 'mp4' | 'webm',
			quality: (process.env.PROCESSING_QUALITY || 'medium') as 'high' | 'medium' | 'low',
			generateThumbnails: process.env.GENERATE_THUMBNAILS === 'true',
			signedUrlExpiration: Number.parseInt(process.env.SIGNED_URL_EXPIRATION || '3600', 10),
		},
		cleanup: {
			deleteAfterDays: Number.parseInt(process.env.CLEANUP_DELETE_AFTER_DAYS || '7', 10),
			cleanupIntervalHours: Number.parseInt(process.env.CLEANUP_INTERVAL_HOURS || '24', 10),
		},
	};
}

/**
 * Validate cloud configuration
 */
export function validateCloudConfig(config: CloudConfig): {
	valid: boolean;
	errors: string[];
} {
	const errors: string[] = [];

	if (config.enabled) {
		if (!config.storage.bucket) {
			errors.push('Storage bucket name is required');
		}

		if (config.provider === 'r2') {
			if (!config.storage.accountId) {
				errors.push('R2 Account ID is required');
			}
			if (!config.storage.endpoint) {
				errors.push('R2 Endpoint URL is required');
			}
		}

		if (config.processing.maxFileSize <= 0) {
			errors.push('Max file size must be greater than 0');
		}

		if (config.processing.defaultSegmentDuration <= 0) {
			errors.push('Default segment duration must be greater than 0');
		}
	}

	return {
		valid: errors.length === 0,
		errors,
	};
}

/**
 * Get R2 credentials from environment variables
 */
export function getR2Credentials() {
	return {
		accessKeyId: process.env.R2_ACCESS_KEY_ID,
		secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
	};
}

/**
 * Check if R2 credentials are configured
 */
export function hasR2Credentials(): boolean {
	const creds = getR2Credentials();
	return !!(creds.accessKeyId && creds.secretAccessKey);
}
