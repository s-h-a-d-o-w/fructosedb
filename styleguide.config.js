const {createConfig, babel} = require('webpack-blocks');
const typescript = require('@webpack-blocks/typescript');
const devServer = require('@webpack-blocks/dev-server');

// Based on: https://github.com/rumble-charts/rumble-charts/blob/master/styleguide.config.js
module.exports = {
	// Available theme variables: https://github.com/styleguidist/react-styleguidist/blob/master/src/styles/theme.js
	theme: {
		color: {
			base: 'white',
			codeBackground: '#D7C3EB !important',
			sidebarBackground: '#D7C3EB',
			light: '#BBB',
			baseBackground: '#653399',
		},
	},
	styles: {
		Logo: {
			logo: {
				color: 'black',
			},
		},
	},
	title: 'fructosedb Styleguide',
	usageMode: 'expand',
	components: 'components/**/*.{js,jsx,ts,tsx}', // Required for Props & Methods to be parsed
	sections: [
		{
			name: 'Components',
			content: './docs/components.md',
			components: function() {
				return ['./components/Burger.tsx'];
			},
		},
	],
	webpackConfig: createConfig([
		devServer(),
		babel(),
		// Using babel for TS is necessary because of "jsx": "preserve" in tsconfig.json
		// (Which is required for the next.js build pipeline)
		typescript({
			useBabel: true,
			babelCore: '@babel/core',
			babelOptions: {
				compact: process.env.NODE_ENV === 'production',
				highlightCode: true,
			},
		}),
	]),
};
