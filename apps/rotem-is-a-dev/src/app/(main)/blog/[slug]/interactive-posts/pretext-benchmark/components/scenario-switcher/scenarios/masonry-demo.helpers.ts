import { prepare, layout, type PreparedText } from '@chenglou/pretext';

const MASONRY_FONT = '15px Inter, sans-serif';
const MASONRY_LINE_HEIGHT = 22;
const CARD_PADDING = 16;
const GAP = 12;

export type PreparedCard = {
	text: string;
	prepared: PreparedText;
	colorIndex: number;
};

export type PositionedCard = {
	cardIndex: number;
	x: number;
	y: number;
	width: number;
	height: number;
};

export type MasonryLayout = {
	positionedCards: PositionedCard[];
	contentHeight: number;
};

const CARD_TEXTS = [
	'API Gateway handles routing, rate limiting, and auth token validation for all inbound requests.',
	'Redis-backed LRU cache with TTL-based invalidation sits between the gateway and the service mesh.',
	'JWT issuance and verification. Delegates to OAuth providers for social login.',
	'Elasticsearch cluster with custom analyzers for multilingual product search. Reindexes nightly.',
	'Edge caching rules and purge automation for the CDN layer.',
	'Processes async jobs from SQS: email sends, webhook deliveries, PDF generation. Retries with exponential backoff.',
	'Prometheus exporters for all services. Grafana dashboards auto-provisioned from Terraform.',
	'LaunchDarkly integration with local fallback for feature flags.',
	'Flyway-managed schema changes with zero-downtime deploy support. Each migration tested against a shadow database.',
	'gRPC service mesh with mTLS, circuit breakers, and automatic retry budgets across all internal services.',
	'Event sourcing pipeline using Kafka. Consumers rebuild projections on demand for analytics and search.',
	'Distributed tracing with OpenTelemetry. Every request gets a trace ID that flows through all services.',
];

export function prepareCards(): PreparedCard[] {
	return CARD_TEXTS.map((text, idx) => ({
		text,
		prepared: prepare(text, MASONRY_FONT),
		colorIndex: idx % 8,
	}));
}

export function computeMasonryLayout(cards: PreparedCard[], containerWidth: number): MasonryLayout {
	const colCount = Math.max(1, Math.floor((containerWidth + GAP) / (200 + GAP)));
	const colWidth = (containerWidth - (colCount - 1) * GAP) / colCount;
	const textWidth = colWidth - CARD_PADDING * 2;

	const colHeights = new Float64Array(colCount);

	const positionedCards: PositionedCard[] = [];

	for (let cardIdx = 0; cardIdx < cards.length; cardIdx++) {
		// Find shortest column
		let shortest = 0;

		for (let col = 1; col < colCount; col++) {
			if ((colHeights[col] ?? 0) < (colHeights[shortest] ?? 0)) {
				shortest = col;
			}
		}

		const { height: textHeight } = layout(cards[cardIdx].prepared, textWidth, MASONRY_LINE_HEIGHT);
		const totalHeight = textHeight + CARD_PADDING * 2;

		positionedCards.push({
			cardIndex: cardIdx,
			x: shortest * (colWidth + GAP),
			y: colHeights[shortest] ?? 0,
			width: colWidth,
			height: totalHeight,
		});

		colHeights[shortest] = (colHeights[shortest] ?? 0) + totalHeight + GAP;
	}

	let contentHeight = 0;

	for (let col = 0; col < colCount; col++) {
		if ((colHeights[col] ?? 0) > contentHeight) {
			contentHeight = colHeights[col] ?? 0;
		}
	}

	return { positionedCards, contentHeight };
}
