import { NextResponse } from 'next/server';
import { getCloudConfig, hasR2Credentials } from '../../../config/cloud.config';
import { getR2Client } from '../../../lib/r2-client';

/**
 * POST /api/cleanup
 *
 * Cleanup old sessions from R2 storage based on configured retention period.
 * This endpoint can be called by a cron job or manually.
 *
 * Query parameters:
 * - maxAgeDays: Override the default retention period (optional)
 * - dryRun: If 'true', only list what would be deleted without actually deleting (optional)
 *
 * Headers:
 * - Authorization: Bearer token for authentication (required in production)
 */
export async function POST(request: Request) {
	const config = getCloudConfig();

	// Check if cloud processing is enabled
	if (!config.enabled) {
		return NextResponse.json(
			{ error: 'Cloud processing is not enabled' },
			{ status: 503 },
		);
	}

	// Check R2 credentials
	if (!hasR2Credentials()) {
		return NextResponse.json(
			{ error: 'R2 credentials not configured' },
			{ status: 503 },
		);
	}

	// Verify authorization in production
	const authHeader = request.headers.get('authorization');
	const cleanupSecret = process.env.CLEANUP_API_SECRET;

	if (cleanupSecret && authHeader !== `Bearer ${cleanupSecret}`) {
		return NextResponse.json(
			{ error: 'Unauthorized' },
			{ status: 401 },
		);
	}

	try {
		const { searchParams } = new URL(request.url);
		const maxAgeDays = parseInt(searchParams.get('maxAgeDays') || String(config.cleanup.deleteAfterDays), 10);
		const dryRun = searchParams.get('dryRun') === 'true';

		if (maxAgeDays < 0) {
			return NextResponse.json(
				{ error: 'maxAgeDays must be 0 or greater' },
				{ status: 400 },
			);
		}

		console.log('[Cleanup] Starting cleanup...', { maxAgeDays, dryRun });

		const r2Client = getR2Client();
		const sessions = await r2Client.listSessions();

		const now = new Date();
		const maxAgeMs = maxAgeDays * 24 * 60 * 60 * 1000;

		const sessionsToDelete = sessions.filter(session => {
			const age = now.getTime() - session.lastModified.getTime();
			return age > maxAgeMs;
		});

		console.log('[Cleanup] Found sessions to delete:', {
			total: sessions.length,
			toDelete: sessionsToDelete.length,
			maxAgeDays,
		});

		if (dryRun) {
			return NextResponse.json({
				success: true,
				dryRun: true,
				totalSessions: sessions.length,
				sessionsToDelete: sessionsToDelete.length,
				sessions: sessionsToDelete.map(s => ({
					sessionId: s.sessionId,
					lastModified: s.lastModified.toISOString(),
					ageInDays: Math.floor((now.getTime() - s.lastModified.getTime()) / (24 * 60 * 60 * 1000)),
				})),
			});
		}

		let totalFilesDeleted = 0;
		const deletedSessions: string[] = [];
		const errors: { sessionId: string; error: string }[] = [];

		for (const session of sessionsToDelete) {
			try {
				const filesDeleted = await r2Client.deleteSession(session.sessionId);
				totalFilesDeleted += filesDeleted;
				deletedSessions.push(session.sessionId);
			} catch (error) {
				console.error('[Cleanup] Failed to delete session:', {
					sessionId: session.sessionId,
					error,
				});
				errors.push({
					sessionId: session.sessionId,
					error: error instanceof Error ? error.message : 'Unknown error',
				});
			}
		}

		console.log('[Cleanup] ✓ Cleanup complete:', {
			sessionsDeleted: deletedSessions.length,
			filesDeleted: totalFilesDeleted,
			errors: errors.length,
		});

		return NextResponse.json({
			success: true,
			totalSessions: sessions.length,
			sessionsDeleted: deletedSessions.length,
			filesDeleted: totalFilesDeleted,
			errors: errors.length > 0 ? errors : undefined,
		});
	} catch (error) {
		console.error('[Cleanup] ✗ Cleanup failed:', error);
		return NextResponse.json(
			{ error: error instanceof Error ? error.message : 'Cleanup failed' },
			{ status: 500 },
		);
	}
}

/**
 * GET /api/cleanup
 *
 * Get information about sessions that would be cleaned up.
 * Same as POST with dryRun=true.
 */
export async function GET(request: Request) {
	const url = new URL(request.url);
	url.searchParams.set('dryRun', 'true');

	return POST(new Request(url.toString(), {
		method: 'POST',
		headers: request.headers,
	}));
}
