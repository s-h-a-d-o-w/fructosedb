import {createStore, applyMiddleware} from 'redux';
import {composeWithDevTools} from 'redux-devtools-extension';
import thunkMiddleware from 'redux-thunk';

import withPersistence from '../lib/with-persistence.js';

export const actionTypes = {
	CHANGE_SORT: 'CHANGE_SORT',
	REHYDRATE: 'REHYDRATE',
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
			return localStorage.getItem('state') === null
				? state
				: JSON.parse(localStorage.getItem('state'));
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
		typeof window === 'undefined' ? reducer : withPersistence(reducer),
		initialState,
		composeWithDevTools(applyMiddleware(thunkMiddleware))
	);
