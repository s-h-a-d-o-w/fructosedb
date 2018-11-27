const path = require('path');
const {match, createConfig, babel, css, file} = require('webpack-blocks');
const typescript = require('@webpack-blocks/typescript');
const devServer = require('@webpack-blocks/dev-server');

// Based on: https://github.com/rumble-charts/rumble-charts/blob/master/styleguide.config.js
module.exports = {
	// Without propsParser react-docgen-typescript, styleguidist throws Syntax Errors.
	// Yet... it is able to parse some things that react-docgen-typescript isn't. For
	// instance LangSelect props (probably via the class).
	propsParser: require('react-docgen-typescript').withDefaultConfig({
		// Discard all props not defined by ourselves but Web API or libraries (e.g. styled-components)
		// Needs tweaking depending on component architecture:
		// https://github.com/styleguidist/react-docgen-typescript/issues/49#issuecomment-439638609
		propFilter: (props) =>
			!props.parent && props.name !== 'innerRef' && props.name !== 'theme',
	}).parse,
	require: ['static/css/global.css'],
	styleguideComponents: {
		Wrapper: path.join(__dirname, 'lib/styleguide/Wrapper'),
	},
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
	components: [
		'./components/Burger.tsx',
		'./containers/LangSelect.tsx',
		'./components/Note.tsx',
		'./components/Paragraph.tsx',
		'./components/TableIcon.tsx',
	],
	webpackConfig: createConfig([
		devServer(),
		babel(),
		match(['*.css', '!*node_modules*'], [css()]),
		match(['*.eot', '*.ttf', '*.woff', '*.woff2'], [file()]),
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
