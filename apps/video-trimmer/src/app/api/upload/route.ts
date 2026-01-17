import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { randomUUID } from 'crypto';

const UPLOAD_DIR = join(process.cwd(), 'tmp', 'uploads');
const MAX_FILE_SIZE = 500 * 1024 * 1024; // 500MB for server processing

export async function POST(request: NextRequest) {
	try {
		const formData = await request.formData();
		const file = formData.get('video') as File | null;

		if (!file) {
			return NextResponse.json({ error: 'No file provided' }, { status: 400 });
		}

		if (file.size > MAX_FILE_SIZE) {
			return NextResponse.json(
				{ error: 'File too large for server processing (max 500MB)' },
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

		// Create session directory
		const sessionId = randomUUID();
		const sessionDir = join(UPLOAD_DIR, sessionId);
		await mkdir(sessionDir, { recursive: true });

		// Get file extension from MIME type
		const extMap: Record<string, string> = {
			'video/mp4': 'mp4',
			'video/quicktime': 'mov',
			'video/webm': 'webm',
			'video/x-msvideo': 'avi',
		};
		const ext = extMap[file.type] || 'mp4';

		// Write file to disk
		const arrayBuffer = await file.arrayBuffer();
		const uint8Array = new Uint8Array(arrayBuffer);
		const filePath = join(sessionDir, `input.${ext}`);
		await writeFile(filePath, uint8Array);

		return NextResponse.json({
			sessionId,
			message: 'Upload successful',
			fileSize: file.size,
			mimeType: file.type,
		});
	} catch (error) {
		console.error('Upload error:', error);
		return NextResponse.json(
			{ error: 'Upload failed' },
			{ status: 500 },
		);
	}
}
