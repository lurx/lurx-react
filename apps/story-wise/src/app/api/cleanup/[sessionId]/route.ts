import { NextRequest, NextResponse } from 'next/server';
import { getCloudConfig } from '../../../../config/cloud.config';
import { getR2Client } from '../../../../lib/r2-client';

interface RouteParams {
	params: Promise<{
		sessionId: string;
	}>;
}

/**
 * DELETE /api/cleanup/[sessionId]
 *
 * Delete all files for a specific session from R2.
 * Called after downloads complete or when user leaves the page.
 */
export async function DELETE(
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

		const { sessionId } = await params;

		if (!sessionId) {
			return NextResponse.json(
				{ error: 'Session ID is required' },
				{ status: 400 },
			);
		}

		console.log('[Cleanup] Deleting session:', { sessionId });

		const r2Client = getR2Client();
		const filesDeleted = await r2Client.deleteSession(sessionId);

		console.log('[Cleanup] ✓ Session deleted:', { sessionId, filesDeleted });

		return NextResponse.json({
			success: true,
			sessionId,
			filesDeleted,
		});
	} catch (error) {
		console.error('[Cleanup] Error:', error);
		return NextResponse.json(
			{
				error: 'Failed to cleanup session',
				message: error instanceof Error ? error.message : 'Unknown error',
			},
			{ status: 500 },
		);
	}
}

/**
 * POST /api/cleanup/[sessionId]
 *
 * Same as DELETE but accepts POST for sendBeacon compatibility.
 * sendBeacon only supports POST requests.
 */
export async function POST(
	request: NextRequest,
	context: RouteParams,
) {
	return DELETE(request, context);
}
