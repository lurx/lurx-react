import './global.css';
import { StoryWizeProvider } from './context/story-wize-context';

export const metadata = {
	title: 'Story Wize - Split videos into 45s clips',
	description:
		'Upload a video and split it into 45-second segments perfect for social media stories',
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" data-theme="dark">
			<body>
				<StoryWizeProvider>{children}</StoryWizeProvider>
			</body>
		</html>
	);
}
