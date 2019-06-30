const path = require('path');
const withBundleAnalyzer = require('@zeit/next-bundle-analyzer');
const withCSS = require('@zeit/next-css');
const withOffline = require('next-offline');

module.exports = withOffline(
	withBundleAnalyzer({
		analyzeServer: ['server', 'both'].includes(process.env.BUNDLE_ANALYZE),
		analyzeBrowser: ['browser', 'both'].includes(process.env.BUNDLE_ANALYZE),
		bundleAnalyzerConfig: {
			server: {
				analyzerMode: 'static',
				reportFilename: '../../bundles/server.html',
			},
			browser: {
				analyzerMode: 'static',
				reportFilename: '../bundles/client.html',
			},
		},
		webpack (config, options) {
			config.resolve.alias['components'] = path.join(__dirname, 'components');
			config.resolve.alias['containers'] = path.join(__dirname, 'containers');
			config.resolve.alias['lib'] = path.join(__dirname, 'lib');
			config.resolve.alias['static'] = path.join(__dirname, 'static');
			config.resolve.alias['store'] = path.join(__dirname, 'store');
			return {
				...config
			}
		}
	})
);
