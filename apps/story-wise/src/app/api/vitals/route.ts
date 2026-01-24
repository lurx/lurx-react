import { NextResponse } from 'next/server';
import { getCloudConfig } from '../../../config/cloud.config';

/**
 * GET /api/vitals
 *
 * Proxies processor /vitals (memory, load, uptime). Used when ?showVitals is in the URL.
 * Returns { available: false } when the processor is not configured.
 */
export async function GET() {
	try {
		const config = getCloudConfig();

		if (!config.processor.url) {
			return NextResponse.json({
				available: false,
				reason: 'Processor not configured',
				timestamp: new Date().toISOString(),
			});
		}

		const res = await fetch(`${config.processor.url}/vitals`, {
			headers: {
				...(config.processor.apiKey && {
					Authorization: `Bearer ${config.processor.apiKey}`,
				}),
			},
		});

		if (!res.ok) {
			return NextResponse.json({
				available: true,
				error: res.statusText,
				status: res.status,
				timestamp: new Date().toISOString(),
			});
		}

		const data = await res.json();
		return NextResponse.json({ ...data, available: true });
	} catch (error) {
		return NextResponse.json({
			available: false,
			error: error instanceof Error ? error.message : 'Unknown error',
			timestamp: new Date().toISOString(),
		});
	}
}
