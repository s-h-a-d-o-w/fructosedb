import {AutoSizer, Table, Column, SortDirection} from 'react-virtualized';
import styled from 'styled-components';
import CenteredContent from '../components/centered-content';

const TableWrapper = styled.div`
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

	.ReactVirtualized__Table__rowColumn {
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

const AvoidIndicator = styled.div`
	display: inline-block;
	width: 0.75rem;
	height: 0.75rem;
	background-color: ${(props: any) =>
		props.avoid ? 'indianred' : 'darkolivegreen'};
`;

/*
export default (props) => (
	<TableWrapper>
		<AutoSizer disableHeight>
			{({width}) => (
				<Table
					headerHeight={30}
					height={300}
					rowHeight={20}
					rowGetter={({index}) => props.data[index]}
					rowCount={props.data.length}
					width={width}
				>
					<Column dataKey="name" label="Name" width={300} />
					<Column dataKey="fructose" label="Fruct. per 100g" width={200} />
				</Table>
			)}
		</AutoSizer>
	</TableWrapper>
);
*/
import React from 'react';
//import styled from 'styled-components';
import memoize from 'memoize-one';
import {connect} from 'react-redux';
import sort from 'fast-sort';

import {actions} from '../store/store.js';

/*
// See: https://github.com/styled-components/styled-components/issues/630#issuecomment-411542050
const component: <Props>(
	Tag: string
) => React.SFC<Props & {className?: string}> = (Tag) => (props) => (
	<Tag className={props.className}>{props.children}</Tag>
);

interface ITableHeader {
	sortAsc: boolean;
	onClick: any;
}
*/

class MyTable extends React.Component<any, any> {
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
				description: 'Fruct. per Serving',
				defaultWidth: 70,
			},
			{
				name: 'sucroseServing',
				description: 'Sucr. per Serving',
				defaultWidth: 70,
			},
			{
				name: 'glucoseServing',
				description: 'Gluc. per Serving',
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

	sortData = memoize((sortBy, sortAsc, lockedAvoid) => {
		return lockedAvoid
			? sort(this.props.data).by([
					{desc: 'avoid'},
					sortAsc ? {asc: sortBy} : {desc: sortBy},
			  ])
			: sort(this.props.data).by([sortAsc ? {asc: sortBy} : {desc: sortBy}]);
	});

	avoidRenderer({cellData}) {
		return <AvoidIndicator avoid={cellData} />;
	}

	render() {
		// TODO: Probably AutoSizer makes table flicker at certain widths. Shouldn't be that difficult to write
		// my own? Resize event handler, get computed width and height of parent.

		const sortedData = this.sortData(
			this.props.sortBy,
			this.props.sortAsc,
			true
		);

		console.log('showServing:', this.props.showServing);
		const headers = this.props.showServing
			? this.state.headersServing
			: this.state.headers;
		const columns: any = headers.map((column) => (
			<Column
				key={column.name}
				dataKey={column.name}
				defaultSortDirection={SortDirection.DESC}
				label={column.description}
				width={column.defaultWidth}
				flexGrow={column.name === 'name' ? 1 : 0}
				{...(column.name === 'avoid' ? {cellRenderer: this.avoidRenderer} : {})}
			/>
		));

		return (
			<CenteredContent gridArea="table">
				<TableWrapper>
					<AutoSizer>
						{({width, height}) => (
							<Table
								headerHeight={45}
								height={height}
								rowHeight={20}
								rowGetter={({index}) => sortedData[index]}
								rowCount={sortedData.length}
								sort={this.changeSorting.bind(this, this.props.dispatch)}
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

export default connect(mapStateToProps)(MyTable);
