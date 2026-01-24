import { NextRequest, NextResponse } from 'next/server';
import { getCloudConfig } from '../../../../config/cloud.config';

interface JobStatusResponse {
	jobId: string;
	sessionId: string;
	status: 'pending' | 'processing' | 'complete' | 'error';
	progress: {
		currentSegment: number;
		totalSegments: number;
		percent: number;
		stage: 'downloading' | 'processing' | 'uploading';
	} | null;
	result: {
		success: boolean;
		duration: number;
		totalSegments: number;
		segments: Array<{
			index: number;
			startTime: number;
			endTime: number;
			duration: number;
		}>;
	} | null;
	error: string | null;
}

/**
 * GET /api/process-status/[jobId]
 *
 * Poll for processing job status.
 */
export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ jobId: string }> }
) {
	try {
		const { jobId } = await params;
		const config = getCloudConfig();

		if (!config.processor.url) {
			return NextResponse.json(
				{ error: 'Processor not configured' },
				{ status: 503 },
			);
		}

		// Call processor to get job status
		const statusResponse = await fetch(`${config.processor.url}/jobs/${jobId}`, {
			method: 'GET',
			headers: {
				...(config.processor.apiKey && {
					Authorization: `Bearer ${config.processor.apiKey}`,
				}),
			},
		});

		if (!statusResponse.ok) {
			if (statusResponse.status === 404) {
				return NextResponse.json(
					{ error: 'Job not found' },
					{ status: 404 },
				);
			}
			const error = await statusResponse.json().catch(() => ({
				error: 'Failed to get job status',
			}));
			return NextResponse.json(error, { status: statusResponse.status });
		}

		const jobStatus: JobStatusResponse = await statusResponse.json();

		// If complete, transform segments to include download URLs
		if (jobStatus.status === 'complete' && jobStatus.result) {
			return NextResponse.json({
				...jobStatus,
				result: {
					...jobStatus.result,
					segments: jobStatus.result.segments.map((seg) => ({
						...seg,
						downloadUrl: `/api/download/${jobStatus.sessionId}/${seg.index}`,
					})),
				},
			});
		}

		return NextResponse.json(jobStatus);
	} catch (error) {
		console.error('[API] Status check error:', error);
		return NextResponse.json(
			{
				error: 'Failed to check status',
				message: error instanceof Error ? error.message : 'Unknown error',
			},
			{ status: 500 },
		);
	}
}
