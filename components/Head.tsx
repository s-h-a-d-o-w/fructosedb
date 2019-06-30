import * as React from 'react';
import NextHead from 'next/head';

export default function Head() {
	return (
		<NextHead>
			<title>fructosedb - find low fructose foods</title>
			<meta
				name="Description"
				content='A list of foods with their fructose and glucose content that allows people
					suffering from fructose malabsorption (also sometimes referred to as "fructose intolerance" or
					"DFI") to adjust their diet more easily.'
			/>
			<meta name="viewport" content="width=device-width, initial-scale=1" />
			<meta name="theme-color" content="#653399" />
			<link rel="manifest" href="/site.webmanifest" />
			{/* Force favicon refresh on changes */}
			<link rel="icon" type="image/x-icon" href="/favicon.ico?v=20181018" />
			<link rel="prefetch" href="/static/images/usda-symbol.svg" />
		</NextHead>
	);
}
