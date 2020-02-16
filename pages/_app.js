// See: https://github.com/zeit/next.js/blob/master/examples/with-redux/pages/_app.js
import React from 'react';
import * as Sentry from '@sentry/node';
import App from 'next/app';
import {Provider} from 'react-redux';

import {DynamicIntlProvider} from 'containers/DynamicIntlProvider';
import withReduxStore from '../lib/with-redux-store';

const isDev = process.env.NODE_ENV !== 'production';

// Could expand the functionality of this by uploading source maps after building.
// Also possibly using _error.js as described here. Workflow seems a bit immature though:
// https://github.com/zeit/next.js/blob/canary/examples/with-sentry-simple/pages/_error.js
Sentry.init({
  dsn: isDev
    ? undefined
    : 'https://25cdec932b684e40b5d132a83958ae49@sentry.io/1771415',
});

if (typeof window !== 'undefined') {
  if (isDev) {
    // const whyDidYouRender = require("@welldone-software/why-did-you-render");
    // whyDidYouRender(React,  {
    // 	collapseGroups: true,
    // 	include: [/.*/],
    // 	exclude: [/FormattedMessage/]
    // });
  }

  console.info('Built on:', process.env.BUILD_TIMESTAMP);
}

class MyApp extends App {
  // See https://github.com/zeit/next.js/tree/canary/examples/with-react-intl
  static async getInitialProps({Component, router, ctx}) {
    let pageProps = {};

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    // Get the `locale` and `messages` from the request object on the server.
    // In the browser, use the same values that the server serialized.
    const {req} = ctx;
    const {locale, messages} = req || window.__NEXT_DATA__.props;

    return {pageProps, locale, messages};
  }

  render() {
    const {Component, locale, messages, pageProps, reduxStore} = this.props;
    return (
      <Provider store={reduxStore}>
        <DynamicIntlProvider locale={locale} messages={messages}>
          <Component {...pageProps} />
        </DynamicIntlProvider>
      </Provider>
    );
  }
}

export default withReduxStore(MyApp);
