import type { ReactNode } from 'react';
import { FaIcon } from '@/app/components';
import styles from './gist-panel.module.scss';

interface GistSnippetProps {
	username: string;
	createdAt: string;
	detailsCount: number;
	starsCount: number;
	children: ReactNode;
}

const GistSnippet = ({
	username,
	createdAt,
	detailsCount,
	starsCount,
	children,
}: GistSnippetProps) => (
	<div className={styles.snippet}>
		<div className={styles.snippetHeader}>
			<div className={styles.userInfo}>
				<div
					className={styles.avatar}
					aria-hidden="true"
				>
					{username.charAt(0).toUpperCase()}
				</div>
				<div className={styles.userDetails}>
					<span className={styles.username}>@{username}</span>
					<span className={styles.createdAt}>{createdAt}</span>
				</div>
			</div>

			<div className={styles.actions}>
				<div className={styles.action}>
					<span className={styles.actionIcon}>
						<FaIcon
							iconName="comment"
							iconGroup="fal"
						/>
					</span>
					<span>{detailsCount} details</span>
				</div>
				<div className={styles.action}>
					<span className={styles.actionIcon}>
						<FaIcon
							iconName="star"
							iconGroup="fal"
						/>
					</span>
					<span>{starsCount} stars</span>
				</div>
			</div>
		</div>

		<div className={styles.codeBlock}>
			<div className={styles.code}>{children}</div>
		</div>
	</div>
);

export const GistPanel = () => {
	return (
		<div className={styles.panel}>
			<p className={styles.panelTitle}>{'// Code snippet showcase:'}</p>

			<div className={styles.snippets}>
				<GistSnippet
					username="lurx"
					createdAt="Created 5 months ago"
					detailsCount={1}
					starsCount={3}
				>
					<span className={styles.kw}>function </span>
					<span>debounce</span>
					<span className={styles.op}>{'<'}</span>
					<span className={styles.generic}>T</span>
					<span className={styles.op}>{'>'}</span>
					<span>{`(`}</span>
					{'\n'}
					<span>{`  fn: (`}</span>
					<span className={styles.op}>...</span>
					<span>args: </span>
					<span className={styles.type}>T</span>
					<span>{`) => `}</span>
					<span className={styles.type}>void</span>
					<span>,</span>
					{'\n'}
					<span>{`  delay: `}</span>
					<span className={styles.type}>number</span>
					{'\n'}
					<span className={styles.op}>{')'}</span>
					<span>{`: (`}</span>
					<span className={styles.op}>...</span>
					<span>args: </span>
					<span className={styles.type}>T</span>
					<span>{`) => `}</span>
					<span className={styles.type}>void</span>
					<span>{` {`}</span>
					{'\n'}
					<span>{`  `}</span>
					<span className={styles.kw}>let </span>
					<span>timeoutId: </span>
					<span className={styles.type}>ReturnType</span>
					<span className={styles.op}>{'<'}</span>
					<span className={styles.kw}>typeof </span>
					<span className={styles.type}>setTimeout</span>
					<span className={styles.op}>{'>'}</span>
					<span>;</span>
					{'\n'}
					<span>{`  `}</span>
					<span className={styles.kw}>return </span>
					<span>(</span>
					<span className={styles.op}>...</span>
					<span>args: </span>
					<span className={styles.type}>T</span>
					<span>{`) => {`}</span>
					{'\n'}
					<span>{`    `}</span>
					<span className={styles.fn}>clearTimeout</span>
					<span>(timeoutId);</span>
					{'\n'}
					<span>{`    timeoutId = `}</span>
					<span className={styles.fn}>setTimeout</span>
					<span>(() </span>
					<span className={styles.op}>{'=> '}</span>
					<span className={styles.fn}>fn</span>
					<span>(</span>
					<span className={styles.op}>...</span>
					<span>args), delay);</span>
					{'\n'}
					<span>{`  };`}</span>
					{'\n'}
					<span>{`}`}</span>
				</GistSnippet>

				<GistSnippet
					username="lurx"
					createdAt="Created 9 months ago"
					detailsCount={0}
					starsCount={0}
				>
					<span className={styles.kw}>function </span>
					<span>chunk</span>
					<span className={styles.op}>{'<'}</span>
					<span className={styles.generic}>T</span>
					<span className={styles.op}>{'>'}</span>
					<span>{`(`}</span>
					{'\n'}
					<span>{`  array: `}</span>
					<span className={styles.type}>T</span>
					<span>[], size: </span>
					<span className={styles.type}>number</span>
					{'\n'}
					<span>{`): `}</span>
					<span className={styles.type}>T</span>
					<span>[][] {'{'}</span>
					{'\n'}
					<span>{`  `}</span>
					<span className={styles.kw}>const </span>
					<span>result: </span>
					<span className={styles.type}>T</span>
					<span>[][] </span>
					<span className={styles.op}>= </span>
					<span>[];</span>
					{'\n'}
					<span>{`  `}</span>
					<span className={styles.kw}>for </span>
					<span>(</span>
					<span className={styles.kw}>let </span>
					<span>i </span>
					<span className={styles.op}>= </span>
					<span>0; i </span>
					<span className={styles.op}>{'< '}</span>
					<span>array.length; i </span>
					<span className={styles.op}>+= </span>
					<span>size) {'{'}</span>
					{'\n'}
					<span>{`    result.`}</span>
					<span className={styles.fn}>push</span>
					<span>(array.</span>
					<span className={styles.fn}>slice</span>
					<span>(i, i </span>
					<span className={styles.op}>+ </span>
					<span>size));</span>
					{'\n'}
					<span>{`  }`}</span>
					{'\n'}
					<span>{`  `}</span>
					<span className={styles.kw}>return </span>
					<span>result;</span>
					{'\n'}
					<span>{`}`}</span>
				</GistSnippet>
			</div>
		</div>
	);
};
