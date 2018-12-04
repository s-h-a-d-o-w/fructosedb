// See: https://github.com/styleguidist/react-styleguidist/blob/master/docs/Thirdparties.md#redux
import React, {Component} from 'react';
import {Provider} from 'react-redux';
import {initializeStore} from 'store/store';

export default class Wrapper extends Component {
	render() {
		return <Provider store={initializeStore()}>{this.props.children}</Provider>;
	}
}
