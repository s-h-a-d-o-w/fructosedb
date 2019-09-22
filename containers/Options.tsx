import * as React from 'react';
import {Dispatch} from 'redux';
import {connect} from 'react-redux';
import styled from 'styled-components';

import theme from 'lib/theme';
import {ReduxState} from 'store';
import {changeFilter, toggleFruit, toggleServing} from 'store/actions';

import {LangSelect} from './LangSelect';

type Props = ReturnType<typeof mapStateToProps> &
	ReturnType<typeof mapDispatchToProps>;

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

const _Options: React.FC<Props> = ({
	dispatchFilter,
	dispatchFruit,
	dispatchServing,
	filter,
	onlyFruit,
	showServingSize,
}) => (
	<StyledOptions>
		<input
			type="checkbox"
			id="showServing"
			checked={showServingSize}
			onChange={dispatchServing}
		/>
		<label htmlFor="showServing">Per Serving</label>
		<input
			type="checkbox"
			id="onlyFruit"
			checked={onlyFruit}
			onChange={dispatchFruit}
		/>
		<label htmlFor="onlyFruit">Only Fruit</label>
		<StyledTextBox
			type="text"
			placeholder="Filter"
			onChange={(e) => {
				dispatchFilter(e.target.value);
			}}
			value={filter}
		/>
		<LangSelect />
	</StyledOptions>
);

const mapStateToProps = ({filter, onlyFruit, showServingSize}: ReduxState) => ({
	filter,
	onlyFruit,
	showServingSize,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
	dispatchFilter: (value: string) => dispatch(changeFilter(value)),
	dispatchFruit: () => dispatch(toggleFruit()),
	dispatchServing: () => dispatch(toggleServing()),
});

export const Options = connect(
	mapStateToProps,
	mapDispatchToProps
)(_Options);
