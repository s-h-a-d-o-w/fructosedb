// Based on: https://egghead.io/lessons/javascript-redux-persisting-the-state-to-the-local-storage
import throttle from 'lodash/throttle';
import {ReduxState} from 'store';

export const loadState = (defaultState: ReduxState): ReduxState => {
  const storedState = localStorage.getItem('reduxState_v1');

  return storedState === null
    ? defaultState
    : {...defaultState, ...JSON.parse(storedState)};
};

export const saveState = throttle((state) => {
  try {
    localStorage.setItem('reduxState_v1', JSON.stringify(state));
  } catch (e) {
    console.error(e);
  }
}, 1000);
