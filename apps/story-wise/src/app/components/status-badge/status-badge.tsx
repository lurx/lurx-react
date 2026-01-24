'use client';

import { useCallback, useEffect, useState } from 'react';
import type { HealthStatus } from '../../api/health/route';
import { StatusBadgeIcon } from './components/status-badge-icon.component';

/**
 * StatusBadge - Shows R2 connection status in bottom right corner
 */
export function StatusBadge() {
	const [health, setHealth] = useState<HealthStatus | null>(null);
	const [loading, setLoading] = useState(true);
	const [expanded, setExpanded] = useState(false);

	const checkHealth = useCallback(async () => {
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
				processor: {
					configured: false,
				},
				mode: 'client-only',
				timestamp: new Date().toISOString(),
			});
		} finally {
			setLoading(false);
		}
	}, [setHealth, setLoading]);

	useEffect(() => {
		checkHealth();
	}, [checkHealth]);

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
		if (health.status === 'healthy' && health.cloud.connected)
			return 'badge-success';
		if (health.status === 'degraded') return 'badge-warning';
		return 'badge-error';
	};

	const getStatusText = () => {
		if (health.cloud.connected) return 'Cloud Ready';
		if (health.mode === 'client-only' && !health.cloud.enabled)
			return 'Client Mode';
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
								<span className="font-medium">
									{health.cloud.enabled ? 'Yes' : 'No'}
								</span>
							</div>
							<div className="flex justify-between">
								<span className="text-base-content/60">R2 Connected:</span>
								<span className="font-medium">
									{health.cloud.connected ? 'Yes' : 'No'}
								</span>
							</div>
							<div className="flex justify-between">
								<span className="text-base-content/60">Processor:</span>
								<span className="font-medium">
									{health.processor?.configured
										? health.processor.url
										: 'Not configured'}
								</span>
							</div>
							{health.cloud.error && (
								<div className="pt-2 border-t border-base-300">
									<span className="text-error text-xs break-all">
										{health.cloud.error}
									</span>
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
					<StatusBadgeIcon health={health} />
					{getStatusText()}
				</button>
			</div>
		</div>
	);
}
