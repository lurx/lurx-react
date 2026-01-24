import { Suspense } from 'react';
import './global.css';
import { StoryWiseProvider } from './context/story-wise-context';
import { Header } from './components/header/header';
import { VitalsFrame } from './components/vitals-frame/vitals-frame';

export const metadata = {
	title: 'Story Wise - Split videos into 45s clips',
	description:
		'Upload a video and split it into 45-second segments perfect for social media stories',
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" data-theme="dark" suppressHydrationWarning>
			<body className="min-h-screen flex flex-col">
				<Header />
				<StoryWiseProvider>{children}</StoryWiseProvider>
				<Suspense fallback={null}>
					<VitalsFrame />
				</Suspense>
			</body>
		</html>
	);
}
