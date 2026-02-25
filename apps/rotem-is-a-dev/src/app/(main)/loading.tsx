import { AnimatedLoader } from '@/app/components/loaders/animated-loader';

export default function MainLoading() {
	return (
		<div
			style={{
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				height: '100%',
			}}
		>
			<AnimatedLoader />
		</div>
	);
}
