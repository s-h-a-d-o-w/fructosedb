import {createStore, applyMiddleware} from 'redux';
import {composeWithDevTools} from 'redux-devtools-extension';
import thunkMiddleware from 'redux-thunk';

import {loadState, saveState} from './local-storage.js';
import {isEmptyObject} from '../lib/util';

export const actionTypes = {
	CHANGE_FILTER: 'CHANGE_FILTER',
	CHANGE_LANGUAGE: 'CHANGE_LANGUAGE',
	CHANGE_SORT: 'CHANGE_SORT',
	CHANGE_TRANSLATION_TARGET: 'CHANGE_TRANSLATION_TARGET',

	KILL_FLOAT: 'KILL_FLOAT',
	REHYDRATE: 'REHYDRATE',
	SHOW_FLOAT: 'SHOW_FLOAT',

	TOGGLE_FRUIT: 'TOGGLE_FRUIT',
	TOGGLE_LOCK_AVOID: 'TOGGLE_LOCK_AVOID',
	TOGGLE_SERVING: 'TOGGLE_SERVING',
};

export const reducer = (state = defaultInitialState, action) => {
	switch (action.type) {
		case actionTypes.CHANGE_FILTER:
			return Object.assign({}, state, {filter: action.value});
		case actionTypes.CHANGE_LANGUAGE:
			return Object.assign({}, state, {lang: action.value});
		case actionTypes.CHANGE_SORT:
			return Object.assign({}, state, {
				sortBy: action.sortBy,
				sortAsc: action.sortAsc,
			});
		case actionTypes.CHANGE_TRANSLATION_TARGET:
			return Object.assign({}, state, {langTranslate: action.value});
		case actionTypes.KILL_FLOAT:
			return isEmptyObject(state.float)
				? state
				: Object.assign({}, state, {
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
		case actionTypes.TOGGLE_FRUIT:
			return Object.assign({}, state, {
				onlyFruit: !state.onlyFruit,
			});
		case actionTypes.TOGGLE_SERVING:
			return Object.assign({}, state, {
				showServing: !state.showServing,
			});
		default:
			return state;
	}
};

export const actions = {
	changeFilter: (value) => ({type: actionTypes.CHANGE_FILTER, value}),
	changeLanguage: (value) => ({type: actionTypes.CHANGE_LANGUAGE, value}),
	changeSort: (sortBy, sortAsc) => ({
		type: actionTypes.CHANGE_SORT,
		sortBy,
		sortAsc,
	}),
	changeTranslationTarget: (value) => ({
		type: actionTypes.CHANGE_TRANSLATION_TARGET,
		value,
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
	toggleFruit: () => ({
		type: actionTypes.TOGGLE_FRUIT,
	}),
	toggleServing: () => ({
		type: actionTypes.TOGGLE_SERVING,
	}),
};

// INITIALIZATION
const defaultInitialState = {
	count: 0,
	float: {},
	lastUpdate: 0,
	lang: 'en',
	light: false,
	lockedAvoid: true,
	onlyFruit: false,
	showServing: false,
	sortBy: 'name',
	sortAsc: true,
};

export const initializeStore = (initialState = defaultInitialState) => {
	return createStore(
		// No persistence on the server.
		typeof window === 'undefined'
			? reducer
			: (...args) => {
					let state = reducer.apply(null, args);

					// Need to skip @@INIT, since that would obviously overwrite whatever state there
					// might be in local storage before we can even use it for rehydration.
					if (args[1].type !== '@@INIT') saveState(state);

					return state;
			  },
		initialState,
		composeWithDevTools(applyMiddleware(thunkMiddleware))
	);
};
