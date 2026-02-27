import { AsciiArtRenderer } from '@/app/components';
import { ASCII_NO_POSTS } from '@/ascii-art';
import styles from '../blog-page.module.scss';

export const NoPosts = () => (
	<div className={styles.empty}>
    <AsciiArtRenderer asciiArt={ASCII_NO_POSTS} asciiArtLabel="No posts found" />
		<p>No posts match the current filters.</p>
	</div>
);
