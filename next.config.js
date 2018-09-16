const CopyWebpackPlugin = require('copy-webpack-plugin');
const withTypescript = require('@zeit/next-typescript');
const withCSS = require('@zeit/next-css');
const withBundleAnalyzer = require('@zeit/next-bundle-analyzer');

const withSVG = (nextConfig = {}) => {
	return Object.assign({}, nextConfig, {
		webpack(config, options) {
			// config.module.rules.push({
			// 	test: /\.svg$/,
			// 	use: ['file-loader'],
			// });

			return nextConfig.webpack(config, options);
		},
	});
};

module.exports = withCSS(
	withTypescript(
		withSVG(
			withBundleAnalyzer({
				analyzeServer: ['server', 'both'].includes(process.env.BUNDLE_ANALYZE),
				analyzeBrowser: ['browser', 'both'].includes(
					process.env.BUNDLE_ANALYZE
				),
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
			})
		)
	)
);
