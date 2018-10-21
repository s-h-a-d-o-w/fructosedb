const env = require('./server/env-config.js');

module.exports = {
	presets: ['next/babel', '@zeit/next-typescript/babel'],
	plugins: [
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
			plugins: ['transform-remove-console'],
		},
	},
};
