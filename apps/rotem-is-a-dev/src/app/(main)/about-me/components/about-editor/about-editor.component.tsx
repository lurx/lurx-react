import styles from './about-editor.module.scss';

const COMMENT_WRAP_WIDTH = 38;

interface BioContent {
	title: string;
	paragraphs: string[];
}

const BIO: BioContent = {
	title: 'About me',
	paragraphs: [
		'I’m Rotem, a Senior Frontend Developer and CSS Expert with over 16 years of experience building for the web. My journey began with hand-coding landing pages and has evolved into architecting robust design systems and frontend infrastructures for global platforms.',
		'I pride myself on being entirely self-taught, driven by a stubborn refusal to ship anything less than pixel-perfect. Whether I’m mentoring developers, interviewing new talent, or defining the next frontend stack, my goal is always the same: creating scalable, high-quality user experiences that last.',
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
