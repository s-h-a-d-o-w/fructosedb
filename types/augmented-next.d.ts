import * as Redux from 'redux';
import {ReduxState} from 'store';

declare module 'next' {
	export interface NextPageContext {
		reduxStore: Redux.Store<ReduxState>;
	}
}
