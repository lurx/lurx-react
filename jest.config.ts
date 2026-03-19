const { getJestProjectsAsync } = require('@nx/jest');

module.exports = async function getJestConfig() {
	return {
		projects: await getJestProjectsAsync(),
	};
};
