import './global.css';
import { VideoTrimmerProvider } from './context/video-trimmer-context';

export const metadata = {
	title: 'Video Trimmer - Split videos into 45s clips',
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
				<VideoTrimmerProvider>{children}</VideoTrimmerProvider>
			</body>
		</html>
	);
}
