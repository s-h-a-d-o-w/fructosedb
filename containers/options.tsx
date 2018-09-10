import React from 'react';
import {connect} from 'react-redux';
import {actions} from '../store/store.js';
import styled from 'styled-components';

const StyledOptions = styled.div`
	margin-bottom: 0.5rem;
`;

const Options = (props) => (
	<StyledOptions>
		<input
			type="checkbox"
			id="showServing"
			checked={props.showServing}
			onChange={props.dispatchServing}
		/>
		<label htmlFor="showServing">Per serving</label>
	</StyledOptions>
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
