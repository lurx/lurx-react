import { NextRequest, NextResponse } from 'next/server';
import { getCloudConfig } from '../../../config/cloud.config';

interface ProcessRequestBody {
	sessionId: string;
	segmentDuration?: number;
	outputFormat?: 'mp4' | 'webm';
	quality?: 'high' | 'medium' | 'low';
}

/**
 * POST /api/process
 *
 * Start processing a video that was uploaded to R2.
 * Returns a job ID immediately - use /api/process-status to poll for completion.
 */
export async function POST(request: NextRequest) {
	console.log('[API] Process request received');
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

		// Check if external processor is configured
		if (!config.processor.url) {
			console.warn('[API] External processor URL not configured');
			return NextResponse.json(
				{
					error: 'Server-side processing unavailable',
					message:
						'FFmpeg is not installed on the server. Vercel serverless functions do not include FFmpeg. Consider using a separate processing service or Cloudflare Workers.',
				},
				{ status: 503 },
			);
		}

		const body = (await request.json()) as ProcessRequestBody;
		const {
			sessionId,
			segmentDuration = config.processing.defaultSegmentDuration,
			outputFormat = config.processing.outputFormat,
			quality = config.processing.quality,
		} = body;

		if (!sessionId) {
			return NextResponse.json(
				{ error: 'Session ID is required' },
				{ status: 400 },
			);
		}

		console.log('[API] Starting async processing:', {
			url: config.processor.url,
			sessionId,
			segmentDuration,
		});

		// Call external processor service - now returns job ID immediately
		const processorResponse = await fetch(`${config.processor.url}/process`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				...(config.processor.apiKey && {
					Authorization: `Bearer ${config.processor.apiKey}`,
				}),
			},
			body: JSON.stringify({
				sessionId,
				segmentDuration,
				outputFormat,
				quality,
			}),
		});

		if (!processorResponse.ok) {
			const error = await processorResponse.json().catch(() => ({
				error: 'Processing failed',
				message: processorResponse.statusText,
			}));
			console.error('[API] Processor error:', error);
			return NextResponse.json(error, { status: processorResponse.status });
		}

		const result = await processorResponse.json();
		console.log('[API] Processing job started:', result);

		// Return job ID for polling
		return NextResponse.json({
			jobId: result.jobId,
			sessionId,
			status: 'pending',
			message: 'Processing started',
		});
	} catch (error) {
		console.error('[API] Processing error:', error);
		return NextResponse.json(
			{
				error: 'Processing failed',
				message: error instanceof Error ? error.message : 'Unknown error',
			},
			{ status: 500 },
		);
	}
}
