// see: https://egghead.io/lessons/javascript-redux-persisting-the-state-to-the-local-storage
import throttle from 'lodash/throttle';

export const loadState = (defaultState) => {
	try {
		return localStorage.getItem('state') === null
			? defaultState
			: JSON.parse(localStorage.getItem('state'));
	} catch (e) {
		console.error(e);
		return defaultState;
	}
};

export const saveState = throttle((state) => {
	try {
		localStorage.setItem('state', JSON.stringify(state));
	} catch (e) {
		console.error(e);
	}
}, 1000);
