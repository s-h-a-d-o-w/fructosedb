// See: https://github.com/zeit/next.js/blob/master/examples/with-redux/pages/_app.js
import React from 'react';
import App, {Container} from 'next/app';
import {Provider} from 'react-redux';

import withReduxStore from '../lib/with-redux-store';

if (typeof window !== 'undefined') {
	if (process.env.NODE_ENV !== 'production') {
		const {whyDidYouUpdate} = require('why-did-you-update');
		//whyDidYouUpdate(React);
	}

	console.info('Built on:', process.env.BUILD_TIMESTAMP);
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
