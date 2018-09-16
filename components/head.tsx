import Head from 'next/head';
import React from 'react';

export default class extends React.PureComponent {
	render() {
		return (
			<Head>
				<title>fructose.db</title>
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<link
					rel="preload"
					href="/static/fonts/roboto-slab.woff"
					as="font"
					type="font/woff"
					crossOrigin="crossorigin"
				/>
				<link
					rel="preload"
					href="/static/fonts/roboto-condensed.woff"
					as="font"
					type="font/woff"
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
							src: url('/static/fonts/roboto-slab.woff') format('woff'),
								url('/static/fonts/roboto-slab.woff2') format('woff2');
							font-display: block;
						}

						@font-face {
							font-family: 'Roboto Condensed';
							src: url('/static/fonts/roboto-condensed.woff') format('woff'),
								url('/static/fonts/roboto-condensed.woff2') format('woff2');
							font-display: block;
						}
					`,
					}}
				/>
			</Head>
		);
	}
}
