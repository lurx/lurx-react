import { NextResponse } from 'next/server';
import { getCloudConfig, hasR2Credentials } from '../../../config/cloud.config';
import { getR2Client } from '../../../lib/r2-client';

export interface HealthStatus {
	status: 'healthy' | 'degraded' | 'unhealthy';
	cloud: {
		enabled: boolean;
		connected: boolean;
		error?: string;
	};
	processor: {
		configured: boolean;
		url?: string;
	};
	mode: 'cloud' | 'client-only';
	timestamp: string;
}

/**
 * GET /api/health
 *
 * Health check endpoint that verifies R2 connection and processor availability.
 */
export async function GET() {
	const config = getCloudConfig();
	const timestamp = new Date().toISOString();

	const processorInfo = {
		configured: !!config.processor.url,
		url: config.processor.url ? new URL(config.processor.url).host : undefined,
	};

	// If cloud not enabled, return client-only mode
	if (!config.enabled) {
		return NextResponse.json<HealthStatus>({
			status: 'healthy',
			cloud: {
				enabled: false,
				connected: false,
			},
			processor: processorInfo,
			mode: 'client-only',
			timestamp,
		});
	}

	// Check if credentials are configured
	if (!hasR2Credentials()) {
		const missing: string[] = [];
		if (!process.env.R2_ACCESS_KEY_ID) missing.push('R2_ACCESS_KEY_ID');
		if (!process.env.R2_SECRET_ACCESS_KEY) missing.push('R2_SECRET_ACCESS_KEY');

		return NextResponse.json<HealthStatus>({
			status: 'degraded',
			cloud: {
				enabled: true,
				connected: false,
				error: `Missing credentials: ${missing.join(', ')}`,
			},
			processor: processorInfo,
			mode: 'client-only',
			timestamp,
		});
	}

	// Check other required config
	if (!config.storage.endpoint || !config.storage.bucket) {
		const missing: string[] = [];
		if (!config.storage.endpoint) missing.push('R2_ENDPOINT');
		if (!config.storage.bucket) missing.push('R2_BUCKET_NAME');

		return NextResponse.json<HealthStatus>({
			status: 'degraded',
			cloud: {
				enabled: true,
				connected: false,
				error: `Missing config: ${missing.join(', ')}`,
			},
			processor: processorInfo,
			mode: 'client-only',
			timestamp,
		});
	}

	// Try to connect to R2
	try {
		const r2Client = getR2Client();
		// Try listing (limited to 1) to verify connection
		await r2Client.listSessions();

		// Determine mode based on processor availability
		const mode = processorInfo.configured ? 'cloud' : 'client-only';

		return NextResponse.json<HealthStatus>({
			status: 'healthy',
			cloud: {
				enabled: true,
				connected: true,
			},
			processor: processorInfo,
			mode,
			timestamp,
		});
	} catch (error) {
		return NextResponse.json<HealthStatus>({
			status: 'degraded',
			cloud: {
				enabled: true,
				connected: false,
				error: error instanceof Error ? error.message : 'Connection failed',
			},
			processor: processorInfo,
			mode: 'client-only',
			timestamp,
		});
	}
}
