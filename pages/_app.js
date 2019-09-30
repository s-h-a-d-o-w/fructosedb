// See: https://github.com/zeit/next.js/blob/master/examples/with-redux/pages/_app.js
import React from 'react';
import App from 'next/app';
import {Provider} from 'react-redux';

import {DynamicIntlProvider} from 'containers/DynamicIntlProvider';
import withReduxStore from '../lib/with-redux-store';

if (typeof window !== 'undefined') {
  if (process.env.NODE_ENV !== 'production') {
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
