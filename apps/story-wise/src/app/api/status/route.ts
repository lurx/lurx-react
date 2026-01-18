import { NextResponse } from 'next/server';
import { getCloudConfig } from '../../../config/cloud.config';

/**
 * GET /api/status
 *
 * Check if the service is online and available.
 * Returns offline if:
 * - SERVICE_OFFLINE env var is set to 'true'
 * - Cloud processing is disabled
 */
export async function GET() {
	// Check manual offline toggle
	const isManuallyOffline = process.env.SERVICE_OFFLINE === 'true';

	if (isManuallyOffline) {
		return NextResponse.json({
			online: false,
			reason: 'maintenance',
			message: process.env.OFFLINE_MESSAGE || 'Service is temporarily offline for maintenance.',
		});
	}

	const config = getCloudConfig();

	// If cloud processing is disabled, we can still work with client-side processing
	// So we're still "online" but in limited mode
	return NextResponse.json({
		online: true,
		cloudEnabled: config.enabled,
		mode: config.enabled ? 'cloud' : 'client-only',
	});
}
