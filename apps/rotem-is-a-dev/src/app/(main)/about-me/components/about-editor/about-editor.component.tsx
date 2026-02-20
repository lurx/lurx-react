import styles from './about-editor.module.scss';

const BIO_LINES = [
	'/**',
	' * About me',
	' * I have 6 years of experience in web',
	' * development, specializing in React,',
	' * TypeScript, and modern frontend',
	' * architecture. I enjoy building',
	' * high-quality, performant UIs with',
	' * a strong focus on clean code,',
	' * design systems, and developer',
	' * experience.',
	' *',
	' * When I am not coding, I enjoy',
	' * gaming, hiking, and exploring',
	' * new technologies.',
	' *',
	' */',
];

export const AboutEditor = () => {
	return (
		<div
			className={styles.editor}
			aria-label="Bio content"
		>
			<div className={styles.lineNumbers}>
				{BIO_LINES.map((_, index) => (
					<span
						key={index}
						className={styles.lineNumber}
					>
						{index + 1}
					</span>
				))}
			</div>
			<div className={styles.codeContent}>
				{BIO_LINES.map((line, index) => (
					<span key={index}>
						{line}
						{'\n'}
					</span>
				))}
			</div>
		</div>
	);
};
