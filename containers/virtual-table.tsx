import React from 'react';
import memoize from 'memoize-one';
import {connect} from 'react-redux';
import sort from 'fast-sort';
import {AutoSizer, Table, Column, SortDirection} from 'react-virtualized';
import styled from 'styled-components';

import CenteredContent from '../components/centered-content';
import {actions} from '../store/store.js';

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
	width: 0.75rem;
	height: 0.75rem;
	background-color: ${(props: any) =>
		props.avoid ? 'indianred' : 'darkolivegreen'};
`;

class VirtualTable extends React.Component<any, any> {
	state = {
		sortBy: 'ratio',
		sortAsc: false,
		headers: [
			{name: 'avoid', description: '🔒', defaultWidth: 30},
			{name: 'name', description: 'Name', defaultWidth: 70},
			{name: 'fructose', description: 'Fruct. per 100g', defaultWidth: 70},
			{name: 'sucrose', description: 'Sucr. per 100g', defaultWidth: 70},
			{name: 'glucose', description: 'Gluc. per 100g', defaultWidth: 70},
			{name: 'ratio', description: 'F/G ratio', defaultWidth: 70},
		],
		headersServing: [
			{name: 'avoid', description: '🔒', defaultWidth: 30},
			{name: 'name', description: 'Name', defaultWidth: 70},
			{name: 'measure', description: 'Serving Size', defaultWidth: 70},
			{
				name: 'fructoseServing',
				description: 'Fruct. p. Serving',
				defaultWidth: 70,
			},
			{
				name: 'sucroseServing',
				description: 'Sucr. p. Serving',
				defaultWidth: 70,
			},
			{
				name: 'glucoseServing',
				description: 'Gluc. p. Serving',
				defaultWidth: 70,
			},
			{name: 'ratio', description: 'F/G ratio', defaultWidth: 70},
		],
	};

	changeSorting(dispatch, sortInfo) {
		dispatch(
			actions.changeSort(
				sortInfo.sortBy,
				sortInfo.sortDirection === SortDirection.ASC
			)
		);
	}

	avoidRenderer({cellData}) {
		return <AvoidIndicator avoid={cellData} />;
	}

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
			true
		);

		const headers = this.props.showServing
			? this.state.headersServing
			: this.state.headers;
		const columns: any = headers.map((column) => (
			<Column
				key={column.name}
				dataKey={column.name}
				defaultSortDirection={
					column.name === 'name' ? SortDirection.ASC : SortDirection.DESC
				}
				label={column.description}
				width={column.defaultWidth}
				flexGrow={column.name === 'name' ? 1 : 0}
				{...(column.name === 'avoid' ? {cellRenderer: this.avoidRenderer} : {})}
				{...(column.name === 'name' ? {cellRenderer: this.nameRenderer} : {})}
			/>
		));

		return (
			<CenteredContent
				gridArea="table"
				onMouseLeave={this.props.dispatchKillFloat}
			>
				<TableWrapper>
					<AutoSizer>
						{({width, height}) => (
							<Table
								headerHeight={45}
								height={height}
								rowHeight={20}
								rowGetter={({index}) => sortedData[index]}
								rowCount={sortedData.length}
								sort={this.props.dispatchChangeSort}
								sortBy={this.props.sortBy}
								sortDirection={
									this.props.sortAsc ? SortDirection.ASC : SortDirection.DESC
								}
								width={width}
							>
								{columns}
							</Table>
						)}
					</AutoSizer>
				</TableWrapper>
			</CenteredContent>
		);
	}
}

const mapStateToProps = (state) => ({
	showServing: state.showServing,
	sortBy: state.sortBy,
	sortAsc: state.sortAsc,
});

const mapDispatchToProps = (dispatch) => ({
	dispatchChangeSort: ({sortBy, sortDirection}) =>
		dispatch(actions.changeSort(sortBy, sortDirection === SortDirection.ASC)),
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
)(VirtualTable);
