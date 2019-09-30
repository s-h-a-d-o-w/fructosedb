// see: https://github.com/zeit/next.js/blob/master/examples/with-redux/lib/with-redux-store.js
import React from 'react';
import NextApp, {AppContext} from 'next/app';
import * as Redux from 'redux';

import {initializeStore, ReduxState} from 'store';
import {rehydrate} from 'store/actions';

const isServer = typeof window === 'undefined';
const __NEXT_REDUX_STORE__ = '__NEXT_REDUX_STORE__';

declare global {
  interface Window {
    __NEXT_REDUX_STORE__: Redux.Store;
  }
}

function getOrCreateStore(
  locale: string | null,
  initialState?: object
): Redux.Store<ReduxState> {
  // Always make a new store if server, otherwise state is shared between requests
  if (isServer) {
    return initializeStore(locale, initialState);
  }

  // Create store if unavailable on the client and set it on the window object
  if (!window[__NEXT_REDUX_STORE__]) {
    window[__NEXT_REDUX_STORE__] = initializeStore(locale, initialState);
  }

  if ((module as any).hot) {
    (module as any).hot.accept('store', () => {
      console.log('Replacing reducer');
      window[__NEXT_REDUX_STORE__].replaceReducer(require('store').reducer);
    });
  }

  return window[__NEXT_REDUX_STORE__];
}

type Props = React.ComponentProps<typeof NextApp> & {
  initialReduxState: ReduxState;
  locale: string;
};

export default (App: typeof NextApp) => {
  return class AppWithRedux extends React.Component<Props> {
    reduxStore: Redux.Store<ReduxState>;

    constructor(props: Props) {
      super(props);
      this.reduxStore = getOrCreateStore(
        props.locale || null,
        props.initialReduxState
      );
    }

    static async getInitialProps(appContext: AppContext) {
      const {req} = appContext.ctx;
      // @ts-ignore
      const {locale} = req || window.__NEXT_DATA__.props;

      // Get or Create the store with `undefined` as initialState
      // This allows you to set a custom default initialState
      const reduxStore = getOrCreateStore(locale);

      // Provide the store to getInitialProps of pages
      // @ts-ignore Passes locally but not on Travis CI for some reason.
      appContext.ctx.reduxStore = reduxStore;

      let appProps = {};
      if (typeof App.getInitialProps === 'function') {
        appProps = await App.getInitialProps.call(App, appContext);
      }

      return {
        ...appProps,
        initialReduxState: reduxStore.getState(),
        locale,
      };
    }

    componentDidMount() {
      // Rehydrating with persisted data needs to happen after initialization
      // so that the initial state from SSR and on the client matches.
      if (!isServer) {
        this.reduxStore.dispatch(rehydrate());
      }
    }

    render() {
      return <App {...this.props} reduxStore={this.reduxStore} />;
    }
  };
};
