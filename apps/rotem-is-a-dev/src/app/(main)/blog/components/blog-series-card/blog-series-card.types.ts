import type { AnyPost } from '../../blog-page.types';
import type { SeriesMeta } from '../../data/blog-series.types';

export type BlogSeriesCardProps = {
	meta: SeriesMeta;
	posts: AnyPost[];
};
