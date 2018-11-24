const env = require('./env-config.js');

module.exports = {
	presets: ['next/babel', '@zeit/next-typescript/babel'],
	plugins: [
		['@babel/plugin-proposal-decorators', {legacy: true}],
		['inline-react-svg'],
		[
			'styled-components',
			{
				ssr: true,
				displayName: true,
			},
		],
		['transform-define', env],
	],
	env: {
		production: {
			plugins: [['transform-remove-console', {exclude: ['info']}]],
		},
	},
};
