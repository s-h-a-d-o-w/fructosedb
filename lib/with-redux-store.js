// see: https://github.com/zeit/next.js/blob/master/examples/with-redux/lib/with-redux-store.js
import React from 'react';
import {initializeStore, actions} from '../store/store';

const isServer = typeof window === 'undefined';
const __NEXT_REDUX_STORE__ = '__NEXT_REDUX_STORE__';

function getOrCreateStore(initialState) {
	// Always make a new store if server, otherwise state is shared between requests
	if (isServer) {
		return initializeStore(initialState);
	}

	// Create store if unavailable on the client and set it on the window object
	if (!window[__NEXT_REDUX_STORE__]) {
		window[__NEXT_REDUX_STORE__] = initializeStore(initialState);
	}

	if (module.hot) {
		module.hot.accept('../store/store.js', () => {
			console.log('Replacing reducer');
			window[__NEXT_REDUX_STORE__].replaceReducer(
				require('../store/store.js').reducer
			);
		});
	}

	return window[__NEXT_REDUX_STORE__];
}

export default (App) => {
	return class AppWithRedux extends React.Component {
		constructor(props) {
			super(props);
			this.reduxStore = getOrCreateStore(props.initialReduxState);
		}

		static async getInitialProps(appContext) {
			// Get or Create the store with `undefined` as initialState
			// This allows you to set a custom default initialState
			const reduxStore = getOrCreateStore();

			// Provide the store to getInitialProps of pages
			appContext.ctx.reduxStore = reduxStore;

			let appProps = {};
			if (typeof App.getInitialProps === 'function') {
				appProps = await App.getInitialProps.call(App, appContext);
			}

			return {
				...appProps,
				initialReduxState: reduxStore.getState(),
			};
		}

		componentDidMount() {
			// Rehydrating with persisted data needs to happen after initialization
			// so that the initial state from SSR and on the client matches.
			if (!isServer) this.reduxStore.dispatch(actions.rehydrate());
		}

		render() {
			return <App {...this.props} reduxStore={this.reduxStore} />;
		}
	};
};
