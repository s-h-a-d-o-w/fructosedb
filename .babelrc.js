module.exports = {
	env: {
		development: {
			presets: [
				"next/babel",
				"@zeit/next-typescript/babel",
			],
		},
		production: {
			presets: [
				"next/babel",
				"@zeit/next-typescript/babel",
			],
		},
		test: {
			presets: [
				[
					"next/babel",
					{
						"preset-env": {
							modules: "commonjs",
						}
					}
				],
				"@zeit/next-typescript/babel",
			]
		}
	},
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
		['transform-define', require('./env-config.js')],
	],
};
