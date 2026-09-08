const MS_FORMAT = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 });
const SUB_10_MS_FORMAT = new Intl.NumberFormat('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 });

export function formatMs(value: number): string {
	if (value < 10) return `${SUB_10_MS_FORMAT.format(value)} ms`;

	return `${MS_FORMAT.format(value)} ms`;
}

/** Adapter for recharts' LabelFormatter, which hands over whatever the data holds. */
export function formatMsLabel(label: unknown): string {
	return formatMs(Number(label));
}
