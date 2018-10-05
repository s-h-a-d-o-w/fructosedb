import * as React from 'react';
import memoize from 'memoize-one';
import {connect} from 'react-redux';
import sort from 'fast-sort';
import {AutoSizer, Table, Column, SortDirection} from 'react-virtualized';
import styled from 'styled-components';
import toPXOriginal from 'to-px';
import theme from '../lib/theme';

import {actions, actionTypes} from '../store/store.js';
import fetch from '../lib/fetch-with-timeout';
import {isEmptyObject} from '../lib/util';

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
		background-color: ${theme.primaryLight};
		border-bottom: whitesmoke 2px solid;

		cursor: pointer;
	}

	.ReactVirtualized__Table__row {
		display: flex;
		align-items: center;
		background-color: ${theme.primaryLight};
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
	// =============================
	// DEFAULT PROPS/STATE
	// =============================
	static defaultProps = {
		filter: '',
	};

	state = {
		data: [],
		dataTranslated: [],
		hasMounted: false,
		translation: {},
	};

	// =============================
	// FIXED DATA
	// =============================
	tableRef = React.createRef<HTMLDivElement>();
	headerData = {
		name: {description: 'Name', remWidth: 0},
		avoid: {description: '🔒', remWidth: 1.5},
		measure: {
			description: 'Serving Size',
			remWidth: 4,
		},
		fructose: {
			description: 'Fruct. per 100g',
			remWidth: 4.5,
		},
		sucrose: {
			description: 'Sucr. per 100g',
			remWidth: 4.5,
		},
		glucose: {
			description: 'Gluc. per 100g',
			remWidth: 4.5,
		},
		fructoseServing: {
			description: 'Fruct. p. Serving',
			remWidth: 4.5,
		},
		sucroseServing: {
			description: 'Sucr. p. Serving',
			remWidth: 4.5,
		},
		glucoseServing: {
			description: 'Gluc. p. Serving',
			remWidth: 4.5,
		},
		ratio: {
			description: 'F/G ratio',
			remWidth: 3.5,
		},
	};

	// =============================
	// HELPER METHODS
	// =============================
	avoidRenderer = ({cellData}) => <AvoidIndicator avoid={cellData} />;

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

	getData = async () => {
		const res = await fetch(`${process.env.BACKEND_URL}/list`);
		const data = await res.json();
		this.setState({data});
	};

	getTranslation = async () => {
		console.log('getTranslation()');

		// Memoize this based on language so that switching back and forth
		// doesn't cause requests?
		const res = await fetch(
			`${process.env.BACKEND_URL}/static/lang/${this.props.lang}.json`
		);
		const translation = await res.json();
		this.setState({translation});
	};

	nameRenderer = ({cellData}) => (
		<div
			onClick={this.props.dispatchShowFloat.bind(this, cellData)}
			onMouseOver={this.props.dispatchShowFloat.bind(this, cellData)}
			onMouseLeave={
				this.props.float.content
					? this.props.dispatchKillFloat.bind(null, this.props.float)
					: undefined
			}
		>
			{cellData}
		</div>
	);

	sortData = memoize((data, sortBy, sortAsc, lockedAvoid) => {
		return data.length === 0
			? data
			: lockedAvoid
				? sort(data).by([
						{desc: 'avoid'},
						sortAsc ? {asc: sortBy} : {desc: sortBy},
				  ])
				: sort(data).by([sortAsc ? {asc: sortBy} : {desc: sortBy}]);
	});

	// Styles have to be consistent on server/client after first load (SSR).
	// Plus, toPX() can only be used in a browser anyway.
	toPX = (...args) =>
		this.state.hasMounted ? toPXOriginal.apply(null, args) : 16;

	translateData = memoize(
		(_, __, lang) =>
			lang === 'en'
				? this.state.data
				: this.state.data.map((el) =>
						Object.assign({}, el, {name: this.state.translation[el.name]})
				  )
	);

	// =============================
	// LIFECYCLE METHODS
	// =============================
	componentDidMount() {
		this.setState({hasMounted: true});
		this.getData();

		if (this.props.lang !== 'en') this.getTranslation();
	}

	async componentDidUpdate(prevProps) {
		// On page load, the general data will probably arrive AFTER the language was already set.
		// In which case, state.translation will be empty.
		if (
			this.props.lang !== 'en' &&
			(isEmptyObject(this.state.translation) ||
				this.props.lang !== prevProps.lang)
		)
			this.getTranslation();
	}

	// shouldComponentUpdate(nextProps, nextState) {
	// 	console.log('props', this.props);
	// 	console.log('props', nextProps);
	// 	console.log('state', this.state === nextState);
	// 	return true;
	// }

	render() {
		//console.log('render');

		// TODO: Probably AutoSizer makes table flicker at certain widths. Shouldn't be that difficult to write
		// my own? Resize event handler, get computed width and height of parent.

		//let begin = performance.now();

		// TRANSLATE DATA
		// Memoized - state.data reference only changes when translation is changed
		// So in other cases, the same reference should end up in data.
		// Checking for language change when translation hasn't arrived yet allows to avoid
		// flash of empty table.
		let data =
			this.props.lang !== 'en' && isEmptyObject(this.state.translation)
				? this.state.data
				: this.translateData(
						this.state.data,
						this.state.translation,
						this.props.lang
				  );
		if (!Array.isArray(data)) data = [];

		// SORT DATA
		data = this.sortData(
			data,
			this.props.sortBy,
			this.props.sortAsc,
			this.props.lockedAvoid
		);

		// FILTER DATA
		if (this.props.filter !== '') {
			let filter = this.props.filter.toLowerCase();
			data = data.filter((el) => el.name.toLowerCase().indexOf(filter) >= 0);
		}

		//console.log('Processing data took:', performance.now() - begin);

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
		const columns = headers.map((column) => (
			<Column
				key={column.name}
				dataKey={column.name}
				defaultSortDirection={
					column.name === 'name' ? SortDirection.ASC : SortDirection.DESC
				}
				label={column.description}
				width={column.remWidth * this.toPX('rem')}
				flexGrow={column.name === 'name' ? 1 : 0}
				{...(column.name === 'avoid' ? {cellRenderer: this.avoidRenderer} : {})}
				{...(column.name === 'name' ? {cellRenderer: this.nameRenderer} : {})}
			/>
		));

		return (
			<TableWrapper innerRef={this.tableRef}>
				<AutoSizer>
					{({width, height}) => (
						<Table
							headerHeight={3.0 * this.toPX('em', this.tableRef.current)}
							height={height}
							rowHeight={1.5 * this.toPX('em', this.tableRef.current)}
							rowGetter={({index}) => data[index]}
							rowCount={data.length}
							sort={this.props.dispatchColAction}
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
		);
	}
}

const mapStateToProps = ({
	filter,
	float,
	lang,
	lockedAvoid,
	showServing,
	sortBy,
	sortAsc,
}) => ({
	filter,
	float,
	lang,
	lockedAvoid,
	showServing,
	sortBy,
	sortAsc,
});

const dispatchColAction = (dispatch, {sortBy: col, sortDirection}) =>
	col === 'avoid'
		? dispatch({type: actionTypes.TOGGLE_LOCK_AVOID})
		: dispatch(actions.changeSort(col, sortDirection === SortDirection.ASC));

const dispatchShowFloat = (dispatch, name, e) => {
	if (e.target.scrollWidth > e.target.clientWidth) {
		e.stopPropagation();
		dispatch(actions.showFloat(name, e.pageX, e.pageY));
	}
};

const mapDispatchToProps = (dispatch) => ({
	dispatchColAction: dispatchColAction.bind(null, dispatch),
	dispatchShowFloat: dispatchShowFloat.bind(null, dispatch),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(VirtualTable);
