// Webpack pre-loader: returns raw file content as a default-exported string.
// Runs before SWC so it receives the original TypeScript source, not compiled JS.
module.exports = function rawLoader(source) {
	this.cacheable && this.cacheable();
	return `export default ${JSON.stringify(source)};`;
};
