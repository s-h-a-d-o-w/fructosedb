import * as React from 'react';
import Head from 'next/head';

export default class extends React.PureComponent {
	render() {
		return (
			<Head>
				<title>fructose db</title>
				<meta
					name="Description"
					content='A list of foods with their fructose and glucose content that allows people
					suffering from fructose malabsorption (also sometimes referred to as "fructose intolerance" or
					"DFI") to adjust their diet more easily.'
				/>
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<link
					rel="preload"
					href="/static/fonts/roboto-slab.woff2"
					as="font"
					type="font/woff2"
					crossOrigin="crossorigin"
				/>
				<link
					rel="preload"
					href="/static/fonts/roboto-condensed.woff2"
					as="font"
					type="font/woff2"
					crossOrigin="crossorigin"
				/>
				<style
					dangerouslySetInnerHTML={{
						__html: `
						/* box-sizing required for border to work within table */
						html {
							box-sizing: border-box;
							font-size: 100%;
						}
						*, *:before, *:after {
							box-sizing: inherit;
						}

						body {
							margin: 0;
						}

						@font-face {
							font-family: 'Roboto Slab';
							src: url('/static/fonts/roboto-slab.woff2') format('woff2'),
								url('/static/fonts/roboto-slab.woff') format('woff');
							font-display: block;
						}

						@font-face {
							font-family: 'Roboto Condensed';
							src: url('/static/fonts/roboto-condensed.woff2') format('woff2'),
								url('/static/fonts/roboto-condensed.woff') format('woff');
							font-display: block;
						}
					`,
					}}
				/>
				{/* TODO: favicon is served but this doesn't work */}
				<link rel="shortcut icon" href="/favicon.ico" />
				<link rel="preload" href="/list" as="fetch" crossOrigin="crossorigin" />
			</Head>
		);
	}
}
