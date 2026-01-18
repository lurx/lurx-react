import { NextResponse } from 'next/server';

/**
 * GET /api/debug-config
 *
 * Debug endpoint to check which environment variables are set.
 * Does NOT expose actual values - only shows if they are set or not.
 */
export async function GET() {
	const envVars = {
		CLOUD_PROCESSING_ENABLED: process.env.CLOUD_PROCESSING_ENABLED,
		R2_ACCOUNT_ID: !!process.env.R2_ACCOUNT_ID,
		R2_ENDPOINT: !!process.env.R2_ENDPOINT,
		R2_BUCKET_NAME: !!process.env.R2_BUCKET_NAME,
		R2_ACCESS_KEY_ID: !!process.env.R2_ACCESS_KEY_ID,
		R2_SECRET_ACCESS_KEY: !!process.env.R2_SECRET_ACCESS_KEY,
	};

	const allSet = Object.values(envVars).every(v => v === true || v === 'true');

	return NextResponse.json({
		status: allSet ? 'all_configured' : 'missing_vars',
		envVars,
		timestamp: new Date().toISOString(),
	});
}
