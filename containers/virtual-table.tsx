import React from 'react';
import memoize from 'memoize-one';
import {connect} from 'react-redux';
import sort from 'fast-sort';
import {AutoSizer, Table, Column, SortDirection} from 'react-virtualized';
import styled from 'styled-components';
import toPXOriginal from 'to-px';
import {withTheme} from 'styled-components';

import {actions, actionTypes} from '../store/store.js';

const toPX = (unit, el?) =>
	typeof document !== 'undefined' ? toPXOriginal(unit, el) : 16;

const TableWrapper = styled.div`
	font-family: 'Roboto Condensed', sans-serif;

	/* Required for AutoSizer to expand correctly */
	width: 100%;
	height: 100%;

	overflow: hidden;
	color: black;

	.ReactVirtualized__Table__Grid {
		outline: 0;
	}
	.ReactVirtualized__Table__headerColumn {
		outline: 0;
	}

	.ReactVirtualized__Table__headerColumn:first-child {
		text-align: center;
	}
	.ReactVirtualized__Table__rowColumn:first-child {
		text-align: center;
	}

	.ReactVirtualized__Table__rowColumn,
	.ReactVirtualized__Table__rowColumn > div {
		text-overflow: ellipsis;
		overflow: hidden;
		white-space: nowrap;
	}

	.ReactVirtualized__Table__headerRow {
		display: flex;
		align-items: center;
		background-color: ${(props) => props.theme.primaryLight};
		border-bottom: whitesmoke 2px solid;

		cursor: pointer;
	}

	.ReactVirtualized__Table__row {
		display: flex;
		align-items: center;
		background-color: ${(props) => props.theme.primaryLight};
		border-bottom: whitesmoke 1px solid;
	}
`;

const AvoidIndicator: any = styled.div`
	display: inline-block;
	width: 0.75em;
	height: 0.75em;
	background-color: ${(props: any) =>
		props.avoid ? 'indianred' : 'darkolivegreen'};
`;

class VirtualTable extends React.Component<any, any> {
	tableRef = React.createRef<HTMLElement>();
	headerData = {
		name: {description: 'Name', smallWidth: 0, largeWidth: 0},
		avoid: {description: '🔒', smallWidth: 25, largeWidth: 30},
		measure: {
			description: 'Serving Size',
			smallWidth: 60,
			largeWidth: 70,
		},
		fructose: {
			description: 'Fruct. per 100g',
			smallWidth: 65,
			largeWidth: 80,
		},
		sucrose: {
			description: 'Sucr. per 100g',
			smallWidth: 60,
			largeWidth: 80,
		},
		glucose: {
			description: 'Gluc. per 100g',
			smallWidth: 60,
			largeWidth: 80,
		},
		fructoseServing: {
			description: 'Fruct. p. Serving',
			smallWidth: 65,
			largeWidth: 70,
		},
		sucroseServing: {
			description: 'Sucr. p. Serving',
			smallWidth: 65,
			largeWidth: 70,
		},
		glucoseServing: {
			description: 'Gluc. p. Serving',
			smallWidth: 65,
			largeWidth: 70,
		},
		ratio: {
			description: 'F/G ratio',
			smallWidth: 50,
			largeWidth: 55,
		},
	};

	avoidRenderer({cellData}) {
		return <AvoidIndicator avoid={cellData} />;
	}

	generateHeaders = (cols) =>
		cols.map((col) =>
			Object.assign(
				{},
				this.headerData[col],
				{name: col},
				col === 'avoid'
					? this.props.lockedAvoid
						? {description: '🔒'}
						: {description: '🔓'}
					: {}
			)
		);

	nameRenderer = ({cellData}) => {
		return (
			<div
				onClick={this.props.dispatchShowFloat.bind(this, cellData)}
				onMouseOver={this.props.dispatchShowFloat.bind(this, cellData)}
				onMouseLeave={this.props.dispatchKillFloat}
			>
				{cellData}
			</div>
		);
	};

	sortData = memoize((sortBy, sortAsc, lockedAvoid) => {
		return lockedAvoid
			? sort(this.props.data).by([
					{desc: 'avoid'},
					sortAsc ? {asc: sortBy} : {desc: sortBy},
			  ])
			: sort(this.props.data).by([sortAsc ? {asc: sortBy} : {desc: sortBy}]);
	});

	render() {
		// TODO: Probably AutoSizer makes table flicker at certain widths. Shouldn't be that difficult to write
		// my own? Resize event handler, get computed width and height of parent.

		//if (!this.props.data) return <div />;

		const sortedData = this.sortData(
			this.props.sortBy,
			this.props.sortAsc,
			this.props.lockedAvoid
		);

		const headers = this.props.showServing
			? this.generateHeaders([
					'avoid',
					'name',
					'measure',
					'fructoseServing',
					'sucroseServing',
					'glucoseServing',
					'ratio',
			  ])
			: this.generateHeaders([
					'avoid',
					'name',
					'fructose',
					'sucrose',
					'glucose',
					'ratio',
			  ]);
		const columns: any = (width) =>
			headers.map((column) => (
				<Column
					key={column.name}
					dataKey={column.name}
					defaultSortDirection={
						column.name === 'name' ? SortDirection.ASC : SortDirection.DESC
					}
					label={column.description}
					width={
						width < this.props.theme.largeThreshold * toPX('em')
							? column.smallWidth
							: column.largeWidth
					}
					flexGrow={column.name === 'name' ? 1 : 0}
					{...(column.name === 'avoid'
						? {cellRenderer: this.avoidRenderer}
						: {})}
					{...(column.name === 'name' ? {cellRenderer: this.nameRenderer} : {})}
				/>
			));

		return (
			<TableWrapper
				innerRef={this.tableRef}
				onMouseLeave={this.props.dispatchKillFloat}
			>
				<AutoSizer>
					{({width, height}) => {
						return (
							<Table
								headerHeight={3.0 * toPX('em', this.tableRef.current)}
								height={height}
								rowHeight={1.5 * toPX('em', this.tableRef.current)}
								rowGetter={({index}) => sortedData[index]}
								rowCount={sortedData.length}
								sort={this.props.dispatchColAction}
								sortBy={this.props.sortBy}
								sortDirection={
									this.props.sortAsc ? SortDirection.ASC : SortDirection.DESC
								}
								width={width}
							>
								{columns(width)}
							</Table>
						);
					}}
				</AutoSizer>
			</TableWrapper>
		);
	}
}

const mapStateToProps = (state) => ({
	showServing: state.showServing,
	sortBy: state.sortBy,
	sortAsc: state.sortAsc,
	lockedAvoid: state.lockedAvoid,
});

const mapDispatchToProps = (dispatch) => ({
	dispatchColAction: ({sortBy: col, sortDirection}) =>
		col === 'avoid'
			? dispatch({type: actionTypes.TOGGLE_LOCK_AVOID})
			: dispatch(actions.changeSort(col, sortDirection === SortDirection.ASC)),
	dispatchKillFloat: () => dispatch(actions.killFloat()),
	dispatchShowFloat: (name, e) => {
		if (e.target.scrollWidth > e.target.clientWidth) {
			e.stopPropagation();
			dispatch(actions.showFloat(name, e.pageX, e.pageY));
		}
	},
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withTheme(VirtualTable));
