// see: https://github.com/zeit/next.js/blob/master/examples/with-redux/pages/_app.js
import App, {Container} from 'next/app';
import React from 'react';
import withReduxStore from '../lib/with-redux-store';
import {Provider} from 'react-redux';

if (typeof window !== 'undefined' && process.env.NODE_ENV !== 'production') {
	const {whyDidYouUpdate} = require('why-did-you-update');
	//whyDidYouUpdate(React);
}

class MyApp extends App {
	render() {
		const {Component, pageProps, reduxStore} = this.props;
		return (
			<Container>
				<Provider store={reduxStore}>
					<Component {...pageProps} />
				</Provider>
			</Container>
		);
	}
}

export default withReduxStore(MyApp);
