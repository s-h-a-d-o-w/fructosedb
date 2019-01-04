import * as React from 'react';
import Head from 'next/head';

export default class extends React.PureComponent {
	render() {
		return (
			<Head>
				<title>fructosedb - find low fructose foods</title>
				<meta
					name="Description"
					content="A list of foods with their fructose and glucose content that allows people
					suffering from fructose malabsorption (also sometimes referred to as &quot;fructose intolerance&quot; or
					&quot;DFI&quot;) to adjust their diet more easily."
				/>
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<meta name="theme-color" content="#653399" />
				<link rel="manifest" href="/site.webmanifest" />
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
				<link rel="stylesheet" href="/static/css/global.css" />
				{/* Force favicon refresh on changes */}
				<link rel="icon" type="image/x-icon" href="/favicon.ico?v=20181018" />
				<link rel="prefetch" href="/static/images/usda-symbol.svg" />
			</Head>
		);
	}
}
