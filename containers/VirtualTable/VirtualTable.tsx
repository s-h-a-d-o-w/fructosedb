import * as React from 'react';
import {connect} from 'react-redux';
import {AutoSizer, Table, Column, SortDirection} from 'react-virtualized';
import toPX from 'to-px';
import {boundMethod} from 'autobind-decorator';

import {actions, actionTypes} from '../../store/store.js';
import {fetchJSON} from '../../lib/fetch-with-timeout';
import {isEmptyObject} from '../../lib/util';
import * as TableSymbols from '../../components/TableSymbols';
import {Food} from '../../server/usda';

import StyledTable from './style';
import * as Data from './data';

type Props = {
	filter: string;
	lang: string;
	lockedAvoid: boolean;
	onlyFruit: boolean;
	showServing: boolean;
	sortBy: string;
	sortAsc: boolean;
	dispatchColAction: (
		object: {
			sortBy: string;
			sortDirection: 'ASC' | 'DESC';
		}
	) => void;
	dispatchShowFloat: (name: string, e: Event) => void;
	dispatchKillFloat: () => void;
};

type State = {
	data: Food[];
	dataTranslated: Food[];
	hasMounted: boolean;
	translation: object;
};

class VirtualTable extends React.Component<Props, State> {
	tableRef = React.createRef<HTMLDivElement>();

	static defaultProps = {
		filter: '',
	};

	state = {
		data: [],
		dataTranslated: [],
		hasMounted: false,
		translation: {},
	};

	// =================================
	// FETCHING, DATA PREPARATION
	// =================================
	@boundMethod
	fetchData() {
		fetchJSON(`list`).then((data) => this.setState({data}));
	}

	@boundMethod
	fetchTranslation() {
		fetchJSON(`static/lang/${this.props.lang}.json`).then((translation) =>
			this.setState({translation})
		);
	}

	@boundMethod
	prepareData(): Food[] {
		// TRANSLATE
		let data: Food[] =
			this.props.lang !== 'en' && isEmptyObject(this.state.translation)
				? this.state.data
				: Data.translateData(
						this.state.data,
						this.state.translation,
						this.props.lang
				  );
		if (!Array.isArray(data)) return [];

		// SORT
		data = Data.sortData(
			data,
			this.props.sortBy,
			this.props.sortAsc,
			this.props.lockedAvoid
		);

		// FILTER
		if (this.props.filter !== '') {
			data = data.filter(
				(el) =>
					el.name.toLowerCase().indexOf(this.props.filter.toLowerCase()) >= 0
			);
		}
		if (this.props.onlyFruit) {
			data = data.filter((el) => el.isFruit);
		}

		return data;
	}

	// =================================
	// RENDER HELPERS
	// =================================
	avoidRenderer = ({cellData}) =>
		cellData ? TableSymbols.Error : TableSymbols.OK;

	nameRenderer = ({cellData}: {cellData: string}) => (
		<div
			onClick={this.props.dispatchShowFloat.bind(this, cellData)}
			onMouseOver={this.props.dispatchShowFloat.bind(this, cellData)}
			onMouseLeave={this.props.dispatchKillFloat}
		>
			{cellData}
		</div>
	);

	@boundMethod
	renderColumns() {
		const headers = this.props.showServing
			? Data.generateHeaders(
					[
						'avoid',
						'name',
						'measure',
						'fructoseServing',
						'sucroseServing',
						'glucoseServing',
						'ratio',
					],
					this.props.lockedAvoid
			  )
			: Data.generateHeaders(
					['avoid', 'name', 'fructose', 'sucrose', 'glucose', 'ratio'],
					this.props.lockedAvoid
			  );

		return headers.map((column) => (
			<Column
				key={column.name}
				dataKey={column.name}
				defaultSortDirection={
					column.name === 'name' ? SortDirection.ASC : SortDirection.DESC
				}
				label={column.description}
				width={column.remWidth * toPX('rem')}
				flexGrow={column.name === 'name' ? 1 : 0}
				{...(column.name === 'avoid' ? {cellRenderer: this.avoidRenderer} : {})}
				{...(column.name === 'name' ? {cellRenderer: this.nameRenderer} : {})}
			/>
		));
	}

	// =============================
	// LIFECYCLE METHODS
	// =============================
	componentDidMount() {
		this.setState({hasMounted: true});
		this.fetchData();

		if (this.props.lang !== 'en') this.fetchTranslation();
	}

	componentDidUpdate(prevProps: Props) {
		// On page load, data will probably arrive AFTER the language was already set.
		// In which case, state.translation will be empty.
		if (
			this.props.lang !== 'en' &&
			(isEmptyObject(this.state.translation) ||
				this.props.lang !== prevProps.lang)
		) {
			this.fetchTranslation();
		}
	}

	render() {
		let data = this.prepareData();

		return (
			<StyledTable innerRef={this.tableRef}>
				<AutoSizer>
					{({width, height}) => (
						<Table
							headerHeight={3.0 * toPX('em', this.tableRef.current)}
							height={height}
							rowHeight={1.5 * toPX('em', this.tableRef.current)}
							rowGetter={({index}) => data[index]}
							rowCount={data.length}
							sort={this.props.dispatchColAction}
							sortBy={this.props.sortBy}
							sortDirection={
								this.props.sortAsc ? SortDirection.ASC : SortDirection.DESC
							}
							width={width}
						>
							{this.renderColumns()}
						</Table>
					)}
				</AutoSizer>
			</StyledTable>
		);
	}
}

const mapStateToProps = ({
	filter,
	lang,
	lockedAvoid,
	onlyFruit,
	showServing,
	sortBy,
	sortAsc,
}) => ({
	filter,
	lang,
	lockedAvoid,
	onlyFruit,
	showServing,
	sortBy,
	sortAsc,
});

const dispatchColAction = (dispatch, {sortBy: col, sortDirection}) =>
	col === 'avoid'
		? dispatch({type: actionTypes.TOGGLE_LOCK_AVOID})
		: dispatch(actions.changeSort(col, sortDirection === SortDirection.ASC));

const dispatchShowFloat = (
	dispatch,
	name: string,
	e: MouseEvent & {target: HTMLElement}
) => {
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
