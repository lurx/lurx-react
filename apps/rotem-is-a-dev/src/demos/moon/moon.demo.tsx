import { Flex, Link } from '@/app/components';
import classNames from 'classnames';
import { DemoContainer } from '../demo-container/demo-container.component';
import {
	CLOUD_GROUPS,
	COMET_KEYS,
	CRATER_KEYS,
	MOON_SIZE,
	STARS,
} from './moon.constants';
import styles from './moon.module.scss';

const inspiredBy = {
	name: 'Moon',
	url: 'https://dribbble.com/shots/5834247-Moon',
	author: 'Julien',
	authorUrl: 'https://dribbble.com/julienc',
};

const DemoCredits = () => (
	<Flex
		gap="small"
		justify="center"
	>
		Inspired by
		<Link href={inspiredBy.url}>{inspiredBy.name}</Link>
		by
		<Link href={inspiredBy.authorUrl}>{inspiredBy.author}</Link>
	</Flex>
);

export const MoonDemo = () => (
	<DemoContainer
		width={MOON_SIZE}
		height={MOON_SIZE}
	>
		<div className={styles.spacer}>
			<div className={styles.moonContainer}>
				<div className={styles['moon-wrapper']}>
					<div className={styles.moon}>
						{CRATER_KEYS.map((key) => (
							<div
								className={styles['moon-crater']}
								key={key}
							/>
						))}
					</div>
					{CLOUD_GROUPS.map((group) => (
						<div
							className={styles[group.styleKey]}
							key={group.styleKey}
						>
							{group.cloudKeys.map((cloudKey) => (
								<div
									className={styles.cloud}
									key={cloudKey}
								/>
							))}
						</div>
					))}
					<div className={styles['glow-wrap']}>
						<div className={styles['moon-glow']} />
					</div>
					<div className={styles.comets}>
						{COMET_KEYS.map((key) => (
							<div
								className={styles.comet}
								key={key}
							/>
						))}
					</div>
					<div>
						{STARS.map((star) => (
							<div
								className={classNames(styles.star, styles[star.size])}
								data-order={star.id}
								key={star.id}
							/>
						))}
					</div>
				</div>
			</div>
			<DemoCredits />
		</div>
	</DemoContainer>
);
