import {createStore, applyMiddleware} from 'redux';
import {composeWithDevTools} from 'redux-devtools-extension';
import thunkMiddleware from 'redux-thunk';

import {loadState} from './local-storage.js';
import withPersistence from '../lib/with-persistence.js';

export const actionTypes = {
	CHANGE_SORT: 'CHANGE_SORT',
	CHANGE_FILTER: 'CHANGE_FILTER',
	KILL_FLOAT: 'KILL_FLOAT',
	TOGGLE_LOCK_AVOID: 'TOGGLE_LOCK_AVOID',
	REHYDRATE: 'REHYDRATE',
	SHOW_FLOAT: 'SHOW_FLOAT',
	TOGGLE_SERVING: 'TOGGLE_SERVING',
};

// REDUCERS
export const reducer = (state = exampleInitialState, action) => {
	switch (action.type) {
		case actionTypes.CHANGE_FILTER:
			return Object.assign({}, state, {filter: action.value});
		case actionTypes.CHANGE_SORT:
			return Object.assign({}, state, {
				sortBy: action.sortBy,
				sortAsc: action.sortAsc,
			});
		case actionTypes.KILL_FLOAT:
			return Object.assign({}, state, {
				float: {},
			});
		case actionTypes.REHYDRATE:
			return loadState(state);
		case actionTypes.SHOW_FLOAT:
			return Object.assign({}, state, {
				float: {
					content: action.content,
					x: action.x,
					y: action.y,
				},
			});
		case actionTypes.TOGGLE_LOCK_AVOID:
			return Object.assign({}, state, {
				lockedAvoid: !state.lockedAvoid,
			});
		case actionTypes.TOGGLE_SERVING:
			return Object.assign({}, state, {
				showServing: !state.showServing,
			});
		default:
			return state;
	}
};

// ACTIONS
export const actions = {
	changeFilter: (value) => ({type: actionTypes.CHANGE_FILTER, value}),
	changeSort: (sortBy, sortAsc) => ({
		type: actionTypes.CHANGE_SORT,
		sortBy,
		sortAsc,
	}),
	killFloat: () => ({
		type: actionTypes.KILL_FLOAT,
	}),
	rehydrate: () => ({
		type: actionTypes.REHYDRATE,
	}),
	showFloat: (content, x, y) => ({
		type: actionTypes.SHOW_FLOAT,
		content,
		x,
		y,
	}),
	toggleServing: () => ({
		type: actionTypes.TOGGLE_SERVING,
	}),
};

// INITIALIZATION
const exampleInitialState = {
	showServing: false,
	lockedAvoid: true,
	sortBy: 'name',
	sortAsc: true,
	lastUpdate: 0,
	light: false,
	count: 0,
	float: {},
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
