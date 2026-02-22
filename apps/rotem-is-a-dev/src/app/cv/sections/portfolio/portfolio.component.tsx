import { Card } from '@/app/cv/components/card';
import { DemoCarousel } from '@/demos/demo-carousel';
import { WolverineDemo, SheepDemo } from '@/demos';


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
