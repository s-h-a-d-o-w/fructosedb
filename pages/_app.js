// see: https://github.com/zeit/next.js/blob/master/examples/with-redux/pages/_app.js
import App, {Container} from 'next/app';
import React from 'react';
import withReduxStore from '../lib/with-redux-store';
import {Provider} from 'react-redux';
import {ThemeProvider} from 'styled-components';

// http://paletton.com/#uid=34y0u0kn5sr5XTpg7ACsGlQGgbR
const theme = {
	largeThreshold: 45, // em
	largeDevices: '@media all and (min-width: 45em)',

	primaryLight: '#D7C3EB',
	primary: '#653399', // almost rebeccapurple
	primaryDark: '#210340',

	// secondaryLight: '#FFF4D0',
	// secondary: '#E3BE3F',
	// secondaryDark: '#5E4900',
};

class MyApp extends App {
	render() {
		const {Component, pageProps, reduxStore} = this.props;
		return (
			<Container>
				<Provider store={reduxStore}>
					<ThemeProvider theme={theme}>
						<Component {...pageProps} />
					</ThemeProvider>
				</Provider>
			</Container>
		);
	}
}

export default withReduxStore(MyApp);
