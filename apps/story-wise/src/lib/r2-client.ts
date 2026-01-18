import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand, DeleteObjectsCommand, HeadObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { getCloudConfig, getR2Credentials, hasR2Credentials } from '../config/cloud.config';

/**
 * R2 Client for interacting with Cloudflare R2 storage
 */
export class R2Client {
	private s3Client: S3Client;
	private bucket: string;
	private config: ReturnType<typeof getCloudConfig>;

	constructor() {
		const config = getCloudConfig();
		const credentials = getR2Credentials();

		console.log('[R2] Initializing R2 client...');

		if (!config.enabled) {
			console.error('[R2] Cloud processing is not enabled');
			throw new Error('Cloud processing is not enabled');
		}

		if (!hasR2Credentials()) {
			const missing: string[] = [];
			if (!credentials.accessKeyId) missing.push('R2_ACCESS_KEY_ID');
			if (!credentials.secretAccessKey) missing.push('R2_SECRET_ACCESS_KEY');
			console.error('[R2] R2 credentials are not configured. Missing:', missing.join(', '));
			throw new Error(`R2 credentials are not configured. Missing: ${missing.join(', ')}`);
		}

		if (!config.storage.bucket) {
			console.error('[R2] R2 bucket name is not configured');
			throw new Error('R2 bucket name is not configured');
		}

		if (!config.storage.endpoint) {
			console.error('[R2] R2 endpoint is not configured');
			throw new Error('R2 endpoint is not configured');
		}

		this.config = config;
		this.bucket = config.storage.bucket;

		console.log('[R2] Connecting to R2...', {
			bucket: this.bucket,
			endpoint: config.storage.endpoint,
			accountId: config.storage.accountId,
		});

		// Create S3 client configured for R2
		this.s3Client = new S3Client({
			region: 'auto', // R2 uses 'auto' for region
			endpoint: config.storage.endpoint,
			credentials: {
				accessKeyId: credentials.accessKeyId ?? '',
				secretAccessKey: credentials.secretAccessKey ?? '',
			},
			forcePathStyle: config.storage.forcePathStyle || false,
		});

		console.log('[R2] ✓ R2 client initialized successfully');
	}

	/**
	 * Upload a file to R2
	 */
	async uploadFile(
		key: string,
		body: Buffer | Uint8Array | ReadableStream,
		contentType?: string,
	): Promise<void> {
		const size = body instanceof Buffer ? body.length : body instanceof Uint8Array ? body.length : 'stream';
		console.log('[R2] Upload start:', { key, contentType, size });

		const startTime = Date.now();
		const command = new PutObjectCommand({
			Bucket: this.bucket,
			Key: key,
			Body: body,
			ContentType: contentType,
		});

		try {
			await this.s3Client.send(command);
			const duration = Date.now() - startTime;
			console.log('[R2] ✓ Upload complete:', { key, duration: `${duration}ms` });
		} catch (error) {
			const duration = Date.now() - startTime;
			console.error('[R2] ✗ Upload failed:', { key, duration: `${duration}ms`, error });
			throw error;
		}
	}

	/**
	 * Upload a file from a File object
	 */
	async uploadFileFromFile(key: string, file: File): Promise<void> {
		console.log('[R2] Preparing file upload:', { key, fileName: file.name, size: file.size, type: file.type });
		const arrayBuffer = await file.arrayBuffer();
		const buffer = Buffer.from(arrayBuffer);

		await this.uploadFile(key, buffer, file.type);
	}

	/**
	 * Check if a file exists in R2
	 */
	async fileExists(key: string): Promise<boolean> {
		console.log('[R2] Checking file existence:', { key });
		try {
			const command = new HeadObjectCommand({
				Bucket: this.bucket,
				Key: key,
			});

			await this.s3Client.send(command);
			console.log('[R2] ✓ File exists:', { key });
			return true;
		} catch (error: unknown) {
			const s3Error = error as { name?: string; $metadata?: { httpStatusCode?: number } };
			if (s3Error.name === 'NotFound' || s3Error.$metadata?.httpStatusCode === 404) {
				console.log('[R2] File not found:', { key });
				return false;
			}
			console.error('[R2] ✗ Error checking file:', { key, error });
			throw error;
		}
	}

	/**
	 * Get a signed URL for downloading a file
	 */
	async getSignedUrl(key: string, expiresIn = 3600): Promise<string> {
		console.log('[R2] Generating signed URL:', { key, expiresIn });
		const command = new GetObjectCommand({
			Bucket: this.bucket,
			Key: key,
		});

		const url = await getSignedUrl(this.s3Client, command, { expiresIn });
		console.log('[R2] ✓ Signed URL generated:', { key, expiresIn });
		return url;
	}

	/**
	 * Delete a file from R2
	 */
	async deleteFile(key: string): Promise<void> {
		console.log('[R2] Deleting file:', { key });
		const command = new DeleteObjectCommand({
			Bucket: this.bucket,
			Key: key,
		});

		try {
			await this.s3Client.send(command);
			console.log('[R2] ✓ File deleted:', { key });
		} catch (error) {
			console.error('[R2] ✗ Delete failed:', { key, error });
			throw error;
		}
	}

	/**
	 * Delete multiple files from R2 (batch operation)
	 */
	async deleteFiles(keys: string[]): Promise<void> {
		if (keys.length === 0) return;

		// R2/S3 supports up to 1000 objects per batch delete
		const batches: string[][] = [];
		for (let i = 0; i < keys.length; i += 1000) {
			batches.push(keys.slice(i, i + 1000));
		}

		for (const batch of batches) {
			console.log('[R2] Batch deleting files:', { count: batch.length });
			const command = new DeleteObjectsCommand({
				Bucket: this.bucket,
				Delete: {
					Objects: batch.map(key => ({ Key: key })),
					Quiet: true,
				},
			});

			try {
				await this.s3Client.send(command);
				console.log('[R2] ✓ Batch delete complete:', { count: batch.length });
			} catch (error) {
				console.error('[R2] ✗ Batch delete failed:', { error });
				throw error;
			}
		}
	}

	/**
	 * List all objects in a session directory
	 */
	async listSessionFiles(sessionId: string): Promise<string[]> {
		const prefix = `sessions/${sessionId}/`;
		console.log('[R2] Listing session files:', { prefix });

		const keys: string[] = [];
		let continuationToken: string | undefined;

		do {
			const command = new ListObjectsV2Command({
				Bucket: this.bucket,
				Prefix: prefix,
				ContinuationToken: continuationToken,
			});

			const response = await this.s3Client.send(command);

			if (response.Contents) {
				for (const obj of response.Contents) {
					if (obj.Key) {
						keys.push(obj.Key);
					}
				}
			}

			continuationToken = response.NextContinuationToken;
		} while (continuationToken);

		console.log('[R2] ✓ Found session files:', { count: keys.length });
		return keys;
	}

	/**
	 * List all sessions in the bucket
	 */
	async listSessions(): Promise<{ sessionId: string; lastModified: Date }[]> {
		console.log('[R2] Listing all sessions...');

		const sessions: Map<string, Date> = new Map();
		let continuationToken: string | undefined;

		do {
			const command = new ListObjectsV2Command({
				Bucket: this.bucket,
				Prefix: 'sessions/',
				ContinuationToken: continuationToken,
			});

			const response = await this.s3Client.send(command);

			if (response.Contents) {
				for (const obj of response.Contents) {
					if (obj.Key) {
						// Extract session ID from path like "sessions/{sessionId}/..."
						const match = obj.Key.match(/^sessions\/([^/]+)\//);
						if (match) {
							const sessionId = match[1];
							const lastModified = obj.LastModified || new Date();
							// Keep the oldest date for each session
							const existing = sessions.get(sessionId);
							if (!existing || lastModified < existing) {
								sessions.set(sessionId, lastModified);
							}
						}
					}
				}
			}

			continuationToken = response.NextContinuationToken;
		} while (continuationToken);

		const result = Array.from(sessions.entries()).map(([sessionId, lastModified]) => ({
			sessionId,
			lastModified,
		}));

		console.log('[R2] ✓ Found sessions:', { count: result.length });
		return result;
	}

	/**
	 * Delete a complete session and all its files
	 */
	async deleteSession(sessionId: string): Promise<number> {
		console.log('[R2] Deleting session:', { sessionId });
		const keys = await this.listSessionFiles(sessionId);

		if (keys.length === 0) {
			console.log('[R2] No files found for session:', { sessionId });
			return 0;
		}

		await this.deleteFiles(keys);
		console.log('[R2] ✓ Session deleted:', { sessionId, filesDeleted: keys.length });
		return keys.length;
	}

	/**
	 * Generate a key for a video file
	 */
	generateVideoKey(sessionId: string, filename: string): string {
		return `sessions/${sessionId}/input/${filename}`;
	}

	/**
	 * Generate a key for a processed segment
	 */
	generateSegmentKey(sessionId: string, segmentIndex: number, format = 'mp4'): string {
		return `sessions/${sessionId}/segments/segment_${String(segmentIndex).padStart(3, '0')}.${format}`;
	}

	/**
	 * Generate a key for a thumbnail
	 */
	generateThumbnailKey(sessionId: string, segmentIndex: number): string {
		return `sessions/${sessionId}/thumbnails/thumbnail_${String(segmentIndex).padStart(3, '0')}.jpg`;
	}

	/**
	 * Get the S3 client instance (for advanced operations)
	 */
	getS3Client(): S3Client {
		return this.s3Client;
	}

	/**
	 * Get the bucket name
	 */
	getBucket(): string {
		return this.bucket;
	}

	/**
	 * Download a file from R2
	 */
	async downloadFile(key: string): Promise<Buffer> {
		console.log('[R2] Download start:', { key });
		const startTime = Date.now();
		const command = new GetObjectCommand({
			Bucket: this.bucket,
			Key: key,
		});

		try {
			const response = await this.s3Client.send(command);
			const chunks: Uint8Array[] = [];

			if (response.Body) {
				for await (const chunk of response.Body as AsyncIterable<Uint8Array>) {
					chunks.push(chunk);
				}
			}

			const buffer = Buffer.concat(chunks);
			const duration = Date.now() - startTime;
			console.log('[R2] ✓ Download complete:', { key, size: buffer.length, duration: `${duration}ms` });
			return buffer;
		} catch (error) {
			const duration = Date.now() - startTime;
			console.error('[R2] ✗ Download failed:', { key, duration: `${duration}ms`, error });
			throw error;
		}
	}
}

/**
 * Get or create R2 client instance
 */
let r2ClientInstance: R2Client | null = null;

export function getR2Client(): R2Client {
	if (!r2ClientInstance) {
		r2ClientInstance = new R2Client();
	}
	return r2ClientInstance;
}
