import {TypedUseSelectorHook, useSelector} from 'react-redux';
import {createStore, applyMiddleware} from 'redux';
import * as Redux from 'redux';
import {composeWithDevTools} from 'redux-devtools-extension';
import thunkMiddleware from 'redux-thunk';

import {Action} from './actions';
import {loadState, saveState} from './local-storage';
import {SupportedLanguages} from 'types';

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

// Locale is needed so that we can set the default language to
// match the SSRed content.
export const initializeStore = (
  locale: string | null,
  state: object = initialState
): Redux.Store => {
  const store = createStore(
    reducer,
    {...state, lang: locale ? (locale as SupportedLanguages) : 'en'},
    composeWithDevTools(applyMiddleware(thunkMiddleware))
  );

  if (typeof window !== 'undefined') {
    store.subscribe(() => saveState(store.getState()));
  }

  return store;
};

export const useTypedSelector: TypedUseSelectorHook<ReduxState> = useSelector;
