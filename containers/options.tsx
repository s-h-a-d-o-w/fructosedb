import React from 'react';
import {connect} from 'react-redux';
import {actions} from '../store/store.js';
import CenteredContent from '../components/centered-content';

const Options = (props) => (
	<CenteredContent gridArea="options">
		<input
			type="checkbox"
			id="showServing"
			checked={props.showServing}
			onChange={props.dispatchServing}
		/>
		<label htmlFor="showServing">Per serving</label>
	</CenteredContent>
);

const mapStateToProps = (state) => ({
	showServing: state.showServing,
});

const mapDispatchToProps = (dispatch) => ({
	dispatchServing: () => dispatch(actions.toggleServing()),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Options);
