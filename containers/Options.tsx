import * as React from 'react';
import {connect} from 'react-redux';
import {actions} from '../store/store.js';
import styled from 'styled-components';
import LangSelect from './LangSelect';

const StyledOptions = styled.div`
	display: flex;
	align-items: center;

	margin-bottom: 0.3rem;
	margin-top: 0.3rem;
`;

const StyledTextBox = styled.input`
	font-family: inherit;
	font-size: inherit;

	margin-left: 0.5rem;
	margin-right: 0.5rem;
	width: 6rem;
`;

class Options extends React.Component<any> {
	handleFilter = (e) => {
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
			<label htmlFor="showServing">Per Serving</label>
			<input
				type="checkbox"
				id="onlyFruit"
				checked={this.props.onlyFruit}
				onChange={this.props.dispatchFruit}
			/>
			<label htmlFor="onlyFruit">Only Fruit</label>
			<StyledTextBox
				type="text"
				placeholder="Filter"
				onChange={this.handleFilter}
				value={this.props.filter}
			/>
			<LangSelect />
		</StyledOptions>
	);
}

const mapStateToProps = ({filter, showServing}) => ({
	filter,
	showServing,
});

const mapDispatchToProps = (dispatch) => ({
	dispatchFilter: (value) => dispatch(actions.changeFilter(value)),
	dispatchFruit: () => dispatch(actions.toggleFruit()),
	dispatchServing: () => dispatch(actions.toggleServing()),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Options);
