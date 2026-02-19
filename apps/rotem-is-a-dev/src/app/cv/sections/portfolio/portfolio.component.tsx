import { Card } from '@/app/cv/components/card';
import { DemoCarousel } from '@/app/cv/demos/demo-carousel';
import { WolverineDemo, SheepDemo } from '@/app/cv/demos';

interface PortfolioItem {
	name: string;
	description: string;
	url?: string;
	tech?: string[];
}

const PORTFOLIO_ITEMS: PortfolioItem[] = [
	{
		name: 'Lorem Ipsum Project',
		description:
			'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
		url: 'https://example.com',
		tech: ['React', 'TypeScript', 'SCSS'],
	},
	{
		name: 'Dolor Sit Amet',
		description:
			'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
		tech: ['Next.js', 'Node.js', 'CSS'],
	},
	{
		name: 'Consectetur Adipiscing',
		description:
			'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
		url: 'https://example.com',
		tech: ['Vue.js', 'SCSS', 'Git'],
	},
];

export const Portfolio = () => {
	return (
		<Card id="portfolio">
			<h3>Portfolio</h3>
			<DemoCarousel>
				<WolverineDemo />
				<SheepDemo />
			</DemoCarousel>
			{/* <div className={styles.grid}>
				{PORTFOLIO_ITEMS.map(item => (
					<PortfolioCard
						key={item.name}
						item={item}
					/>
				))}
			</div> */}
		</Card>
	);
};
