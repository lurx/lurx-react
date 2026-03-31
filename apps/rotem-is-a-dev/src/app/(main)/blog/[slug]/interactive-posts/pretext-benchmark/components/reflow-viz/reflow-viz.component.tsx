import styles from './reflow-viz.module.scss';

export function ReflowViz() {
	return (
		<div className={styles.container}>
			<div className={styles.label}>
				INTERLEAVED PATTERN &mdash; each component reads independently
			</div>
			<div className={styles.row}>
				<span className={styles.rowLabel}>Component A</span>
				<div className={`${styles.block} ${styles.write}`} style={{ width: 90 }}>write DOM</div>
				<div className={`${styles.block} ${styles.read}`} style={{ width: 70 }}>read &#x26A1;</div>
				<div className={`${styles.block} ${styles.reflow}`} style={{ width: 110 }}>REFLOW</div>
				<div className={`${styles.block} ${styles.empty}`} style={{ width: 100 }} />
			</div>
			<div className={styles.row}>
				<span className={styles.rowLabel}>Component B</span>
				<div className={`${styles.block} ${styles.empty}`} style={{ width: 90 }} />
				<div className={`${styles.block} ${styles.empty}`} style={{ width: 70 }} />
				<div className={`${styles.block} ${styles.write}`} style={{ width: 90 }}>write DOM</div>
				<div className={`${styles.block} ${styles.read}`} style={{ width: 70 }}>read &#x26A1;</div>
				<div className={`${styles.block} ${styles.reflow}`} style={{ width: 110 }}>REFLOW</div>
			</div>
			<div className={styles.legend}>
				<div className={styles.legendItem}>
					<div className={`${styles.legendDot} ${styles.write}`} />
					DOM write
				</div>
				<div className={styles.legendItem}>
					<div className={`${styles.legendDot} ${styles.read}`} />
					getBoundingClientRect / offsetHeight
				</div>
				<div className={styles.legendItem}>
					<div className={`${styles.legendDot} ${styles.reflow}`} />
					forced synchronous layout
				</div>
			</div>
		</div>
	);
}
