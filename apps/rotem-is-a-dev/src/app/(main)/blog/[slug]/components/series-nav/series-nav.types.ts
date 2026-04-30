import type { AnyPost } from '../../../blog-page.types';
import type { SeriesMeta } from '../../../data/blog-series.types';

export type SeriesNavProps = {
	meta: SeriesMeta;
	posts: AnyPost[];
	currentSlug: string;
};
