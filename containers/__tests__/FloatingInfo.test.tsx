import React from 'react';
import {mount} from 'enzyme';
import {render} from '@testing-library/react';
import * as Redux from 'redux';
import {Provider} from 'react-redux';
import 'jest-styled-components';

import {initialState, initializeStore} from 'store';

import FloatingInfo, {VERTICAL_OFFSET} from '../FloatingInfo';

let store: Redux.Store;

describe('<FloatingInfo>', () => {
	beforeEach(() => {
		store = initializeStore(
			Object.assign({}, initialState, {
				float: {
					x: 100,
					y: 100,
					content: 'unit test',
				},
			})
		);
	});

	it('snapshots correctly', () => {
		const {container} = render(
			<Provider store={store}>
				<FloatingInfo />
			</Provider>
		);
		expect(container.firstChild).toMatchSnapshot();
	});

	it('sets "top" to the correct offset', () => {
		const wrapper = mount(
			<Provider store={store}>
				<FloatingInfo />
			</Provider>
		);
		expect((wrapper.find('div').prop('style') as CSSStyleDeclaration).top).toBe(
			`${100 - VERTICAL_OFFSET}px`
		);
	});

	it("doesn't render if float is empty", () => {
		store = initializeStore(initialState);

		const wrapper = mount(
			<Provider store={store}>
				<FloatingInfo />
			</Provider>
		);

		expect(wrapper.find('div').length).toEqual(0);
	});
});
