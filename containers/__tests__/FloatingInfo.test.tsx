import React from 'react';
import {shallow} from 'enzyme';

// TODO: Keep an eye on following issue to expand snapshot in the future:
// https://github.com/styled-components/jest-styled-components/issues/191#issuecomment-439387211
// import 'jest-styled-components';

import FloatingInfo, {VERTICAL_OFFSET} from '../FloatingInfo';
import {defaultInitialState, initializeStore} from '../../store/store';

let store;

describe('<FloatingInfo>', () => {
	beforeEach(() => {
		store = initializeStore(
			Object.assign(defaultInitialState, {
				float: {
					x: 100,
					y: 100,
					content: 'unit test',
				},
			})
		);
	});

	it('snapshots correctly', () => {
		// @ts-ignore
		const wrapper = shallow(<FloatingInfo store={store} />).dive().dive();
		expect(wrapper.instance()).toMatchSnapshot();
	});

	it('sets "top" to the correct offset', () => {
		// @ts-ignore
		const wrapper = shallow(<FloatingInfo store={store} />).dive().dive();
		expect((wrapper.prop('style') as CSSStyleDeclaration).top).toEqual(`${100 - VERTICAL_OFFSET}px`);
	});

	it('returns null if float is empty', () => {
		store = initializeStore(
			Object.assign(defaultInitialState, {
				float: {},
			})
		);

		// @ts-ignore
		const wrapper = shallow(<FloatingInfo store={store} />).dive();
		expect(wrapper.getElement()).toEqual(null);
	});
});
