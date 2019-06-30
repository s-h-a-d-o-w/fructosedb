// See: https://github.com/zeit/next.js/blob/master/examples/with-redux/pages/_app.js
import React from 'react';
import App, {Container} from 'next/app';
import {Provider} from 'react-redux';
import {createGlobalStyle} from "styled-components";

import withReduxStore from '../lib/with-redux-store';

if (typeof window !== 'undefined') {
	if (process.env.NODE_ENV !== 'production') {
		const {whyDidYouUpdate} = require('why-did-you-update');
		//whyDidYouUpdate(React);
	}

	console.info('Built on:', process.env.BUILD_TIMESTAMP);
}

const GlobalStyle = createGlobalStyle`
	html {
		box-sizing: border-box;
		font-size: 100%;
	}
	*,
	*:before,
	*:after {
		box-sizing: inherit;
	}
	
	body {
		color: white;
		font-family: 'Roboto Slab', serif;
		margin: 0;
	}
	
	@font-face {
		font-family: 'Roboto Slab';
		src: url('../static/fonts/roboto-slab.woff2') format('woff2'),
			url('../static/fonts/roboto-slab.woff') format('woff');
		font-display: block;
	}
	
	@font-face {
		font-family: 'Roboto Condensed';
		src: url('../static/fonts/roboto-condensed.woff2') format('woff2'),
			url('../static/fonts/roboto-condensed.woff') format('woff');
		font-display: block;
	}
`;

class MyApp extends App {
	render() {
		const {Component, pageProps, reduxStore} = this.props;
		return (
			<Container>
				<GlobalStyle />
				<Provider store={reduxStore}>
					<Component {...pageProps} />
				</Provider>
			</Container>
		);
	}
}

export default withReduxStore(MyApp);
