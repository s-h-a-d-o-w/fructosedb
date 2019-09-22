import {createStore, applyMiddleware} from 'redux';
import * as Redux from 'redux';
import {composeWithDevTools} from 'redux-devtools-extension';
import thunkMiddleware from 'redux-thunk';

import {Action} from './actions';
import {loadState, saveState} from './local-storage';
import {SupportedLanguages} from 'types';

export const reducer = (
	state: ReduxState = initialState,
	action: Action
): ReduxState => {
	switch (action.type) {
		case 'CHANGE_FILTER':
			return {
				...state,
				filter: action.value,
			};
		case 'CHANGE_LANGUAGE':
			return {
				...state,
				lang: action.value,
			};
		case 'CHANGE_SORT':
			return {
				...state,
				sortBy: action.sortBy,
				sortAsc: action.sortAsc,
			};
		case 'CHANGE_TRANSLATION_TARGET':
			return {
				...state,
				langTranslate: action.value,
			};
		case 'HIDE_FLOAT':
			if (!state.float) return state;

			const {float, ...stateWithoutFloat} = state;
			return stateWithoutFloat;
		case 'REHYDRATE':
			return loadState(state);
		case 'SHOW_FLOAT':
			return {
				...state,
				float: {
					content: action.content,
					x: action.x,
					y: action.y,
				},
			};
		case 'TOGGLE_FRUIT':
			return {
				...state,
				onlyFruit: !state.onlyFruit,
			};
		case 'TOGGLE_SERVING':
			return {
				...state,
				showServingSize: !state.showServingSize,
			};
		default:
			return state;
	}
};

// INITIALIZATION
export type ReduxState = typeof initialState & {
	float?: {
		x: number;
		y: number;
		content: string;
	};
};

export const initialState = {
	count: 0,
	filter: '',
	lastUpdate: 0,
	lang: 'en' as SupportedLanguages,
	langTranslate: 'en',
	light: false,
	onlyFruit: false,
	showServingSize: false,
	sortBy: 'name',
	sortAsc: true,
};

export const initializeStore = (state: object = initialState): Redux.Store => {
	return createStore(
		// No persistence on the server.
		typeof window === 'undefined'
			? reducer
			: (state: ReduxState = initialState,
			   action: Action) => {
					const nextState = reducer.call(null, state, action);

					// Need to skip @@INIT, since that would obviously overwrite whatever state there
					// might be in local storage before we can even use it for rehydration.
					if (action.type !== '@@INIT') saveState(nextState);

					return nextState;
			  },
		state,
		composeWithDevTools(applyMiddleware(thunkMiddleware))
	);
};
