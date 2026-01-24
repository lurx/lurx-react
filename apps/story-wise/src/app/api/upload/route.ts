import { randomUUID } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { getCloudConfig } from '../../../config/cloud.config';
import { getR2Client } from '../../../lib/r2-client';
import type { Nullable } from '../../types/utility-types.types';

export async function POST(request: NextRequest) {
	console.log('[API] Upload request received');
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

		console.log('[API] Cloud processing enabled, processing upload...');
		const formData = await request.formData();
		const file = formData.get('video') as Nullable<File>;

		if (!file) {
			return NextResponse.json({ error: 'No file provided' }, { status: 400 });
		}

		// Check file size
		if (file.size > config.processing.maxFileSize) {
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
		if (!allowedTypes.includes(file.type)) {
			return NextResponse.json(
				{ error: `Unsupported format: ${file.type}` },
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
		const ext = extMap[file.type] || 'mp4';
		const filename = `input.${ext}`;

		// Upload to R2
		console.log('[API] Initializing R2 client...');
		const r2Client = getR2Client();
		const key = r2Client.generateVideoKey(sessionId, filename);

		console.log('[API] Starting upload to R2:', { sessionId, key, fileSize: file.size });
		await r2Client.uploadFileFromFile(key, file);
		console.log('[API] ✓ Upload to R2 complete:', { sessionId, key });

		return NextResponse.json({
			sessionId,
			message: 'Upload successful',
			fileSize: file.size,
			mimeType: file.type,
			key, // Return the R2 key for reference
		});
	} catch (error) {
		console.error('Upload error:', error);

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
			{ error: 'Upload failed', message: error instanceof Error ? error.message : 'Unknown error' },
			{ status: 500 },
		);
	}
}
