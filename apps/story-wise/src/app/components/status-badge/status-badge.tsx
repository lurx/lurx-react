'use client';

import { useState, useEffect } from 'react';
import type { HealthStatus } from '../../api/health/route';

/**
 * StatusBadge - Shows R2 connection status in bottom right corner
 */
export function StatusBadge() {
	const [health, setHealth] = useState<HealthStatus | null>(null);
	const [loading, setLoading] = useState(true);
	const [expanded, setExpanded] = useState(false);

	useEffect(() => {
		const checkHealth = async () => {
			try {
				const response = await fetch('/api/health');
				const data = await response.json();
				setHealth(data);
			} catch {
				setHealth({
					status: 'unhealthy',
					cloud: {
						enabled: false,
						connected: false,
						error: 'Failed to check health',
					},
					mode: 'client-only',
					timestamp: new Date().toISOString(),
				});
			} finally {
				setLoading(false);
			}
		};

		checkHealth();
	}, []);

	if (loading) {
		return (
			<div className="fixed bottom-4 right-4 z-50">
				<div className="badge badge-ghost gap-2">
					<span className="loading loading-spinner loading-xs" />
					Checking...
				</div>
			</div>
		);
	}

	if (!health) return null;

	const getStatusColor = () => {
		if (health.status === 'healthy' && health.cloud.connected) return 'badge-success';
		if (health.status === 'degraded') return 'badge-warning';
		return 'badge-error';
	};

	const getStatusIcon = () => {
		if (health.status === 'healthy' && health.cloud.connected) {
			return (
				<svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
					<path fillRule="evenodd" d="M5.5 16a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 16h-8z" clipRule="evenodd" />
				</svg>
			);
		}
		if (health.mode === 'client-only') {
			return (
				<svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
					<path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.123.489.804.321A1 1 0 0113.315 17H6.685a1 1 0 01-.632-1.74l.804-.321.123-.489H5a2 2 0 01-2-2V5zm2 0h10v8H5V5z" clipRule="evenodd" />
				</svg>
			);
		}
		return (
			<svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
				<path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
			</svg>
		);
	};

	const getStatusText = () => {
		if (health.cloud.connected) return 'Cloud Ready';
		if (health.mode === 'client-only' && !health.cloud.enabled) return 'Client Mode';
		return 'Client Fallback';
	};

	return (
		<div className="fixed bottom-4 right-4 z-50">
			<div className="flex flex-col items-end gap-2">
				{expanded && (
					<div className="card bg-base-200 shadow-lg p-3 text-xs max-w-xs animate-in fade-in slide-in-from-bottom-2">
						<div className="space-y-2">
							<div className="flex justify-between">
								<span className="text-base-content/60">Mode:</span>
								<span className="font-medium">{health.mode}</span>
							</div>
							<div className="flex justify-between">
								<span className="text-base-content/60">Cloud Enabled:</span>
								<span className="font-medium">{health.cloud.enabled ? 'Yes' : 'No'}</span>
							</div>
							<div className="flex justify-between">
								<span className="text-base-content/60">R2 Connected:</span>
								<span className="font-medium">{health.cloud.connected ? 'Yes' : 'No'}</span>
							</div>
							{health.cloud.error && (
								<div className="pt-2 border-t border-base-300">
									<span className="text-error text-xs break-all">{health.cloud.error}</span>
								</div>
							)}
						</div>
					</div>
				)}
				<button
					type="button"
					onClick={() => setExpanded(!expanded)}
					className={`badge ${getStatusColor()} gap-1.5 cursor-pointer hover:opacity-80 transition-opacity`}
				>
					{getStatusIcon()}
					{getStatusText()}
				</button>
			</div>
		</div>
	);
}
