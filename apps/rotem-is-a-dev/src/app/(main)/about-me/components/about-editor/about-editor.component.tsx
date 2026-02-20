import styles from './about-editor.module.scss';

const COMMENT_WRAP_WIDTH = 38;

interface BioContent {
	title: string;
	paragraphs: string[];
}

const BIO: BioContent = {
	title: 'About me',
	paragraphs: [
		'I have 6 years of experience in web development, specializing in React, TypeScript, and modern frontend architecture. I enjoy building high-quality, performant UIs with a strong focus on clean code, design systems, and developer experience.',
		'When I am not coding, I enjoy gaming, hiking, and exploring new technologies.',
	],
};

const wrapWords = (text: string, maxWidth: number): string[] => {
	const words = text.split(' ');
	const lines: string[] = [];
	let current = '';

	for (const word of words) {
		if (current === '') {
			current = word;
		} else if (current.length + 1 + word.length <= maxWidth) {
			current += ` ${word}`;
		} else {
			lines.push(current);
			current = word;
		}
	}

	if (current) lines.push(current);
	return lines;
};

const toJsdocLines = ({ title, paragraphs }: BioContent): string[] => {
	const lines = ['/**', ` * ${title}`];

	paragraphs.forEach((paragraph, index) => {
		wrapWords(paragraph, COMMENT_WRAP_WIDTH).forEach((line) =>
			lines.push(` * ${line}`),
		);
		if (index < paragraphs.length - 1) lines.push(' *');
	});

	lines.push(' *', ' */');
	return lines;
};

const BIO_LINES = toJsdocLines(BIO);

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
