import { NextRequest, NextResponse } from 'next/server';
import { getR2Client } from '../../../../../lib/r2-client';
import { getCloudConfig } from '../../../../../config/cloud.config';

interface RouteParams {
	params: Promise<{
		sessionId: string;
		segmentIndex: string;
	}>;
}

/**
 * GET /api/download/[sessionId]/[segmentIndex]
 *
 * Streams video segment directly from R2 to avoid CORS issues with COEP.
 * This proxies the download through our API instead of redirecting to signed URLs.
 */
export async function GET(
	request: NextRequest,
	{ params }: RouteParams,
) {
	try {
		const config = getCloudConfig();

		if (!config.enabled) {
			return NextResponse.json(
				{ error: 'Cloud processing is not enabled' },
				{ status: 503 },
			);
		}

		const { sessionId, segmentIndex } = await params;

		if (!sessionId || !segmentIndex) {
			return NextResponse.json(
				{ error: 'Session ID and segment index are required' },
				{ status: 400 },
			);
		}

		const index = Number.parseInt(segmentIndex, 10);
		if (Number.isNaN(index) || index < 0) {
			return NextResponse.json(
				{ error: 'Invalid segment index' },
				{ status: 400 },
			);
		}

		const r2Client = getR2Client();
		const segmentKey = r2Client.generateSegmentKey(
			sessionId,
			index,
			config.processing.outputFormat,
		);

		// Check if segment exists
		const exists = await r2Client.fileExists(segmentKey);
		if (!exists) {
			return NextResponse.json(
				{ error: 'Segment not found' },
				{ status: 404 },
			);
		}

		// Download file from R2 and stream it back
		const buffer = await r2Client.downloadFile(segmentKey);
		const contentType = config.processing.outputFormat === 'mp4' ? 'video/mp4' : 'video/webm';

		return new NextResponse(buffer, {
			status: 200,
			headers: {
				'Content-Type': contentType,
				'Content-Length': buffer.length.toString(),
				'Cache-Control': 'public, max-age=3600',
				// Allow cross-origin access for video playback
				'Cross-Origin-Resource-Policy': 'cross-origin',
			},
		});
	} catch (error) {
		console.error('Download error:', error);

		if (error instanceof Error) {
			if (
				error.message.includes('not enabled') ||
				error.message.includes('not configured')
			) {
				return NextResponse.json(
					{ error: error.message },
					{ status: 503 },
				);
			}
		}

		return NextResponse.json(
			{
				error: 'Failed to download segment',
				message: error instanceof Error ? error.message : 'Unknown error',
			},
			{ status: 500 },
		);
	}
}
