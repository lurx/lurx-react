'use client';

import { useCallback } from 'react';
import { CodeBlock } from '@/app/components';
import type { BenchmarkWidgetProps, ItemCount } from './benchmark-widget.types';
import styles from './benchmark-widget.module.scss';

const ITEM_COUNT_OPTIONS: ItemCount[] = [100, 250, 500, 1000, 2500, 5000];

export function BenchmarkWidget({
	title,
	description,
	rows,
	status,
	onRunAction,
	isRunning,
	sourceCode,
	itemCount,
	onItemCountChangeAction,
	showSource,
	onToggleSourceAction,
}: Readonly<BenchmarkWidgetProps>) {
	const handleCountChange = useCallback((ev: React.ChangeEvent<HTMLSelectElement>) => {
		onItemCountChangeAction(Number(ev.target.value) as ItemCount);
	}, [onItemCountChangeAction]);

	const handleRun = useCallback(() => {
		onRunAction(itemCount);
	}, [onRunAction, itemCount]);

	return (
		<div className={styles.widget}>
			<div className={styles.header}>
				<span className={styles.title}>{title}</span>
				<div className={styles.headerActions}>
					{sourceCode && (
						<button
							className={styles.sourceBtn}
							onClick={onToggleSourceAction}
							type="button"
						>
							{showSource ? 'Hide Source' : 'View Source'}
						</button>
					)}
					<select
						className={styles.countSelect}
						value={itemCount}
						onChange={handleCountChange}
						disabled={isRunning}
					>
						{ITEM_COUNT_OPTIONS.map(count => (
							<option key={count} value={count}>
								{count.toLocaleString()} items
							</option>
						))}
					</select>
					<button
						className={styles.runBtn}
						onClick={handleRun}
						disabled={isRunning}
						type="button"
					>
						{isRunning ? 'Running\u2026' : '\u25B6 Run'}
					</button>
				</div>
			</div>
			<div className={styles.body}>
				{showSource && sourceCode && (
					<div className={styles.sourceBlock}>
						<CodeBlock code={sourceCode} language="javascript" />
					</div>
				)}
				{description && <div className={styles.setup}>{description}</div>}
				<div className={styles.rows}>
					{rows.map(row => (
						<div key={row.label} className={styles.row}>
							<span className={styles.rowLabel}>{row.label}</span>
							<div className={styles.barWrap}>
								<div
									className={styles.bar}
									style={{
										backgroundColor: row.color,
										width: `${row.percentage}%`,
									}}
								/>
								<span
									className={styles.barValue}
									style={{ insetInlineStart: `calc(${row.percentage}% + 8px)` }}
								>
									{row.value}
								</span>
							</div>
						</div>
					))}
				</div>
				<p className={styles.status}>{status}</p>
			</div>
		</div>
	);
}
