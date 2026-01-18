import {
	S3Client,
	PutObjectCommand,
	GetObjectCommand,
	DeleteObjectCommand,
	ListObjectsV2Command,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import type { Config } from './config';

/**
 * R2/S3 storage client for the processor service
 */
export class StorageClient {
	private s3Client: S3Client;
	private bucket: string;

	constructor(config: Config) {
		this.bucket = config.storage.bucket;

		this.s3Client = new S3Client({
			region: 'auto',
			endpoint: config.storage.endpoint,
			credentials: {
				accessKeyId: config.storage.accessKeyId,
				secretAccessKey: config.storage.secretAccessKey,
			},
		});

		console.log('[Storage] Initialized:', {
			bucket: this.bucket,
			endpoint: config.storage.endpoint,
		});
	}

	/**
	 * Download a file from storage
	 */
	async downloadFile(key: string): Promise<Buffer> {
		console.log('[Storage] Downloading:', key);

		const command = new GetObjectCommand({
			Bucket: this.bucket,
			Key: key,
		});

		const response = await this.s3Client.send(command);
		const chunks: Uint8Array[] = [];

		if (response.Body) {
			for await (const chunk of response.Body as AsyncIterable<Uint8Array>) {
				chunks.push(chunk);
			}
		}

		const buffer = Buffer.concat(chunks);
		console.log('[Storage] Downloaded:', key, `(${buffer.length} bytes)`);
		return buffer;
	}

	/**
	 * Upload a file to storage
	 */
	async uploadFile(key: string, body: Buffer, contentType?: string): Promise<void> {
		console.log('[Storage] Uploading:', key, `(${body.length} bytes)`);

		const command = new PutObjectCommand({
			Bucket: this.bucket,
			Key: key,
			Body: body,
			ContentType: contentType,
		});

		await this.s3Client.send(command);
		console.log('[Storage] Uploaded:', key);
	}

	/**
	 * Delete a file from storage
	 */
	async deleteFile(key: string): Promise<void> {
		const command = new DeleteObjectCommand({
			Bucket: this.bucket,
			Key: key,
		});

		await this.s3Client.send(command);
		console.log('[Storage] Deleted:', key);
	}

	/**
	 * List files with a prefix
	 */
	async listFiles(prefix: string): Promise<string[]> {
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

		return keys;
	}

	/**
	 * Generate a signed URL for downloading
	 */
	async getSignedUrl(key: string, expiresIn = 3600): Promise<string> {
		const command = new GetObjectCommand({
			Bucket: this.bucket,
			Key: key,
		});

		return getSignedUrl(this.s3Client, command, { expiresIn });
	}

	/**
	 * Generate storage keys for a session
	 */
	generateKeys(sessionId: string) {
		return {
			inputPrefix: `sessions/${sessionId}/input/`,
			segmentKey: (index: number, format: string) =>
				`sessions/${sessionId}/segments/segment_${String(index).padStart(3, '0')}.${format}`,
		};
	}
}
