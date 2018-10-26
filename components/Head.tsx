import * as React from 'react';
import Head from 'next/head';

export default class extends React.PureComponent {
	render() {
		return (
			<Head>
				<title>fructosedb</title>
				<meta
					name="Description"
					content="A list of foods with their fructose and glucose content that allows people
					suffering from fructose malabsorption (also sometimes referred to as &quot;fructose intolerance&quot; or
					&quot;DFI&quot;) to adjust their diet more easily."
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
				{/* Force favicon refresh on changes */}
				<link rel="icon" type="image/x-icon" href="/favicon.ico?v=20181018" />
				<link rel="prefetch" href="/static/images/usda-symbol.svg" />
			</Head>
		);
	}
}
