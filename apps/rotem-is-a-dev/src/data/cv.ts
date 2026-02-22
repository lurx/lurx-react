const cv: CvContextValue = {
	name: 'Rotem Horovitz',
	titles: ['Senior Frontend Developer', 'Tech Lead', 'CSS Expert'],
	intro:
		"I taught myself everything I know — and I haven't stopped. Over %numYears% years I've gone from hand-coding landing pages to architecting design systems used across entire product suites. No boot camp, no degree, just curiosity and a stubborn refusal to ship anything I'm not proud of.",
	contact: {
		email: 'lurxie@gmail.com',
		phone: '+972-52-5229-225',
		social: {
			linkedin: 'https://linkedin.com/in/rotem-lurx-horovitz-9601705',
			github: 'https://github.com/lurx',
		},
	},
	work_experience: [
		{
			company: 'Payoneer',
			position: 'Senior Front End Engineer',
			duration: { start: 2023, end: 2026 },
			description: 'Senior Frontend Developer.',
			achievements: [
				"Created & maintained Payoneer's design system library, ensuring consistency and efficiency across all frontend projects.",
				'Designed and implemented reusable frontend utilities, tools, and standards.',
				'Mentored developers during code reviews and provided guidance on best practices, fostering a culture of continuous learning and improvement within the team.',
				'Was part of the frontend infrastructure team that was responsible for the frontend architecture of the company, and was involved in the decision making process of the frontend stack, tools and standards.',
				'Interviewed candidates for frontend positions, assessing technical skills and cultural fit to ensure the growth of a strong and cohesive team.',
			],
		},
		{
			company: 'Startup Booster',
			position: 'Front End Lead | Senior Front End Engineer',
			duration: { start: 2020, end: 2023 },
			description:
				"Building websites and web apps for the company's clients. Notable examples: EquityBee's website, Bayern Deli (since has shut down).",
			achievements: [
				'Led the frontend development of multiple high-profile projects, delivering robust and scalable web applications.',
				'Mentored junior developers, fostering a culture of continuous learning and improvement within the team.',
				'Collaborated closely with designers and backend developers to ensure seamless integration and optimal user experience.',
			],
		},
		{
			company: 'investing.com',
			position: 'Front-End Developer | CSS Specialist',
			duration: { start: 2012, end: 2020 },
			description:
				"Building websites and web apps for the company's clients. Notable examples: EquityBee's website, Bayern Deli (since has shut down).",
			achievements: [
				"Building and maintenance of HTML and CSS for the all of the company's products (desktop, mobile, mobile applications).",
				"Built HTML and CSS for the company's marketing team (email marketing, banners, etc).",
				'Created and modified JavaScript modules (jQuery/ES6).',
			],
		},
		{
			company: 'iSocia',
			position: 'Designer | Landing Page developer',
			duration: { start: 2010, end: 2012 },
			description:
				"Building websites and web apps for the company's clients. Notable examples: EquityBee's website, Bayern Deli (since has shut down).",
			achievements: [
				"Designing and coding social media and landing pages for the company's clients, with integration of contact forms.",
				'Creating social media presence layouts.',
				"Maintaining mailing lists for clients' promotion.",
			],
		},
	],
	skills: [
		{ name: 'html', icon: 'html5', iconGroup: 'fab', level: 10 },
		{ name: 'css', icon: 'css', iconGroup: 'fab', level: 10 },
		{ name: 'javascript', icon: 'js', iconGroup: 'fab', level: 10 },
		{ name: 'react', icon: 'react', iconGroup: 'fab', level: 10 },
		{ name: 'css-in-js', icon: 'css', iconGroup: 'fab', level: 10 },
		{ name: 'scss', icon: 'sass', iconGroup: 'fab', level: 10 },
		{ name: 'git', icon: 'git', iconGroup: 'fab', level: 8 },
		{ name: 'vue js', icon: 'vuejs', iconGroup: 'fab', level: 5 },
	],
	languages: ['English (Fluent)', 'Hebrew (Native)'],
};

export default cv;
