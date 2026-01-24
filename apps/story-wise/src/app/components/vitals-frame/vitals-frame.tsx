'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { VITALS_POLL_MS } from '../../constants/vitals.constants';

interface VitalsResponse {
	available: boolean;
	reason?: string;
	error?: string;
	status?: number;
	memory?: {
		heapUsedMb: number;
		heapTotalMb: number;
		rssMb: number;
		externalMb: number;
	};
	system?: {
		freememMb: number;
		totalmemMb: number;
		loadAvg: [number, number, number];
	};
	uptimeSeconds?: number;
	timestamp?: string;
}

export function VitalsFrame() {
	const searchParams = useSearchParams();
	const [vitals, setVitals] = useState<VitalsResponse | null>(null);

	const show = searchParams.get('showVitals') !== null;

	useEffect(() => {
		if (!show) return;

		const fetchVitals = async () => {
			try {
				const res = await fetch('/api/vitals');
				const data: VitalsResponse = await res.json();
				setVitals(data);
			} catch (e) {
				setVitals({
					available: false,
					error: e instanceof Error ? e.message : 'Fetch failed',
				});
			}
		};

		fetchVitals();
		const id = setInterval(fetchVitals, VITALS_POLL_MS);
		return () => clearInterval(id);
	}, [show]);

	if (!show) return null;

	return (
		<div
			className="fixed bottom-0 left-0 z-50 max-w-[280px] rounded-tr-xl border border-base-content/20 bg-base-300/95 px-3 py-2 font-mono text-xs shadow-lg backdrop-blur"
			aria-label="Processor vitals"
		>
			<div className="mb-1 font-semibold text-base-content/80">Processor vitals</div>
			{vitals == null && <div className="text-base-content/50">…</div>}
			{vitals != null && !vitals.available && (
				<div className="text-warning">
					{vitals.reason ?? vitals.error ?? 'Unavailable'}
				</div>
			)}
			{vitals != null && vitals.available && vitals.memory && vitals.system && (
				<div className="space-y-0.5 text-base-content/90">
					<div>
						heap <span className="tabular-nums">{vitals.memory.heapUsedMb}</span> /{' '}
						<span className="tabular-nums">{vitals.memory.heapTotalMb}</span> MB
					</div>
					<div>
						rss <span className="tabular-nums">{vitals.memory.rssMb}</span> MB
					</div>
					<div>
						mem free{' '}
						<span className="tabular-nums">{vitals.system.freememMb}</span> /{' '}
						<span className="tabular-nums">{vitals.system.totalmemMb}</span> MB
					</div>
					<div>
						load{' '}
						<span className="tabular-nums">
							{vitals.system.loadAvg[0].toFixed(2)} {vitals.system.loadAvg[1].toFixed(2)}{' '}
							{vitals.system.loadAvg[2].toFixed(2)}
						</span>
					</div>
					{vitals.uptimeSeconds != null && (
						<div>
							uptime <span className="tabular-nums">{vitals.uptimeSeconds}</span>s
						</div>
					)}
					{vitals.timestamp && (
						<div className="pt-0.5 text-[10px] text-base-content/50">{vitals.timestamp}</div>
					)}
				</div>
			)}
			{vitals != null && vitals.available && vitals.error && !vitals.memory && (
				<div className="text-warning">{vitals.error}</div>
			)}
		</div>
	);
}
