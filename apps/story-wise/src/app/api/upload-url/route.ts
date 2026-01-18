import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { getCloudConfig } from '../../../config/cloud.config';
import { getR2Client } from '../../../lib/r2-client';

/**
 * POST /api/upload-url
 *
 * Returns a presigned URL for direct upload to R2.
 * This bypasses Vercel's 4.5MB body size limit by having
 * the client upload directly to R2.
 */
export async function POST(request: NextRequest) {
	console.log('[API] Upload URL request received');
	try {
		const config = getCloudConfig();

		// Check if cloud processing is enabled
		if (!config.enabled) {
			console.warn('[API] Cloud processing is not enabled');
			return NextResponse.json(
				{ error: 'Cloud processing is not enabled' },
				{ status: 503 },
			);
		}

		const body = await request.json();
		const { filename, contentType, fileSize } = body;

		if (!filename || !contentType) {
			return NextResponse.json(
				{ error: 'filename and contentType are required' },
				{ status: 400 },
			);
		}

		// Check file size
		if (fileSize && fileSize > config.processing.maxFileSize) {
			return NextResponse.json(
				{
					error: `File too large (max ${Math.round(config.processing.maxFileSize / 1024 / 1024)}MB)`,
				},
				{ status: 413 },
			);
		}

		// Validate MIME type
		const allowedTypes = [
			'video/mp4',
			'video/quicktime',
			'video/webm',
			'video/x-msvideo',
		];
		if (!allowedTypes.includes(contentType)) {
			return NextResponse.json(
				{ error: `Unsupported format: ${contentType}` },
				{ status: 415 },
			);
		}

		// Create session ID
		const sessionId = randomUUID();

		// Get file extension from MIME type
		const extMap: Record<string, string> = {
			'video/mp4': 'mp4',
			'video/quicktime': 'mov',
			'video/webm': 'webm',
			'video/x-msvideo': 'avi',
		};
		const ext = extMap[contentType] || 'mp4';
		const inputFilename = `input.${ext}`;

		// Get R2 client and generate key
		console.log('[API] Generating presigned URL for direct upload...');
		const r2Client = getR2Client();
		const key = r2Client.generateVideoKey(sessionId, inputFilename);

		// Create presigned URL for PUT operation
		const command = new PutObjectCommand({
			Bucket: r2Client.getBucket(),
			Key: key,
			ContentType: contentType,
		});

		const uploadUrl = await getSignedUrl(r2Client.getS3Client(), command, {
			expiresIn: 3600, // 1 hour
		});

		console.log('[API] ✓ Presigned URL generated:', { sessionId, key });

		return NextResponse.json({
			sessionId,
			uploadUrl,
			key,
			expiresIn: 3600,
		});
	} catch (error) {
		console.error('Upload URL generation error:', error);

		// Handle specific R2 errors
		if (error instanceof Error) {
			if (error.message.includes('not enabled') || error.message.includes('not configured')) {
				return NextResponse.json(
					{ error: error.message },
					{ status: 503 },
				);
			}
		}

		return NextResponse.json(
			{ error: 'Failed to generate upload URL', message: error instanceof Error ? error.message : 'Unknown error' },
			{ status: 500 },
		);
	}
}
