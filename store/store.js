import {createStore, applyMiddleware} from 'redux';
import {composeWithDevTools} from 'redux-devtools-extension';
import thunkMiddleware from 'redux-thunk';

import {loadState} from './local-storage.js';
import withPersistence from '../lib/with-persistence.js';

export const actionTypes = {
	CHANGE_SORT: 'CHANGE_SORT',
	REHYDRATE: 'REHYDRATE',
	TOGGLE_MENU: 'TOGGLE_MENU',
};

// REDUCERS
export const reducer = (state = exampleInitialState, action) => {
	switch (action.type) {
		case actionTypes.CHANGE_SORT:
			return Object.assign({}, state, {
				sortBy: action.sortBy,
				sortAsc: action.sortAsc,
			});
		case actionTypes.REHYDRATE:
			return loadState(state);
		case actionTypes.TOGGLE_MENU:
			return Object.assign({}, state, {
				showMenu: !state.showMenu,
			});
		default:
			return state;
	}
};

// ACTIONS
export const actions = {
	changeSort: (sortBy, sortAsc) => {
		return {
			type: actionTypes.CHANGE_SORT,
			sortBy,
			sortAsc,
		};
	},
	rehydrate: () => ({
		type: actionTypes.REHYDRATE,
	}),
	toggleMenu: () => ({
		type: actionTypes.TOGGLE_MENU,
	}),
};

// INITIALIZATION
const exampleInitialState = {
	sortBy: 'name',
	sortAsc: true,
	lastUpdate: 0,
	light: false,
	count: 0,
};

export const initializeStore = (initialState = exampleInitialState) =>
	createStore(
		// No persistence for SSR.
		// Also: Could provide a blacklist or whitelist to withPersistence for which
		// keys of the state to store.
		typeof window === 'undefined' ? reducer : withPersistence(reducer),
		initialState,
		composeWithDevTools(applyMiddleware(thunkMiddleware))
	);
