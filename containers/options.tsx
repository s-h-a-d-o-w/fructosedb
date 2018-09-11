import React from 'react';
import {connect} from 'react-redux';
import {actions} from '../store/store.js';
import styled from 'styled-components';

const StyledOptions = styled.div`
	margin-bottom: 0.3rem;
`;

const StyledTextBox = styled.input`
	font-family: inherit;
	font-size: inherit;

	margin-left: 1rem;
`;

class Options extends React.Component<any> {
	state = {
		filter: '',
	};

	handleFilter = (e) => {
		// Redundant but otherwise, React warning about uncontrolled input is triggered
		this.setState({filter: e.target.value});
		this.props.dispatchFilter(e.target.value);
	};

	render = () => (
		<StyledOptions>
			<input
				type="checkbox"
				id="showServing"
				checked={this.props.showServing}
				onChange={this.props.dispatchServing}
			/>
			<label htmlFor="showServing">Per serving</label>
			<StyledTextBox
				type="text"
				placeholder="Filter"
				onChange={this.handleFilter}
				value={this.state.filter}
			/>
		</StyledOptions>
	);
}

const mapStateToProps = (state) => ({
	showServing: state.showServing,
});

const mapDispatchToProps = (dispatch) => ({
	dispatchServing: () => dispatch(actions.toggleServing()),
	dispatchFilter: (value) => dispatch(actions.changeFilter(value)),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Options);