import * as React from 'react';
import {Dispatch} from 'redux';
import {connect} from 'react-redux';
import styled from 'styled-components';

import theme from 'lib/theme';
import {ReduxState} from 'store';
import {changeFilter, toggleFruit, toggleServing} from 'store/actions';

import LangSelect from './LangSelect';

const StyledOptions = styled.div`
	display: flex;
	align-items: center;

	margin-bottom: 0.3rem;
	margin-top: 0.3rem;

	font-size: 0.8rem;
	${theme.largeDevices} {
		font-size: inherit;
	}

	input {
		margin-left: 0.5rem;
	}

	input[type='checkbox'] {
		position: relative;
		top: 1px;

		width: 1.2em;
		height: 1.2em;
	}

	label {
		white-space: nowrap;
	}
`;

const StyledTextBox = styled.input`
	font-family: inherit;
	font-size: inherit;

	width: 7.5rem;
	${theme.largeDevices} {
		width: 10rem;
	}
`;

type Props = ReturnType<typeof mapStateToProps> &
	ReturnType<typeof mapDispatchToProps>;

class Options extends React.Component<Props> {
	handleFilter: React.ChangeEventHandler<HTMLInputElement> = (e) => {
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

const mapStateToProps = ({filter, onlyFruit, showServing}: ReduxState) => ({
	filter,
	onlyFruit,
	showServing,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
	dispatchFilter: (value: string) => dispatch(changeFilter(value)),
	dispatchFruit: () => dispatch(toggleFruit()),
	dispatchServing: () => dispatch(toggleServing()),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Options);
