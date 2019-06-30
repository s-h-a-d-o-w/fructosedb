import * as React from 'react';
import {boundMethod} from 'autobind-decorator';
import debounce from 'lodash/debounce';
import isEqual from 'lodash/isEqual';
import {connect} from 'react-redux';
import {Dispatch} from 'redux';
import {AutoSizer, Table, Column, SortDirection} from 'react-virtualized';
import toPX from 'to-px';

import Loading from 'components/Loading';
import TableIcon from 'components/TableIcon';
import {fetchJSON} from 'lib/fetch-with-timeout';
import {isEmptyObject} from 'lib/util';
import {toggleLockAvoid, changeSort, showFloat, hideFloat} from 'store/actions';
import {ReduxState} from 'store';
import {Food} from 'types';

import StyledTable from './style';
import * as Data from './data';

type Props = ReturnType<typeof mapStateToProps> &
	ReturnType<typeof mapDispatchToProps>;

type State = {
	data: Food[];
	dataProcessed: Food[];
	isFetching: boolean;
	translation: {[key: string]: string};
};

class VirtualTable extends React.Component<Props, State> {
	tableRef = React.createRef<HTMLDivElement>();

	state = {
		data: [],
		dataProcessed: [],
		isFetching: false,
		translation: {},
	};

	// =================================
	// FETCHING, DATA PREPARATION
	// =================================
	@boundMethod
	fetchData() {
		fetchJSON(`list`).then((data) =>
			this.setState({
				data,
				isFetching: false,
			})
		);
	}

	@boundMethod
	fetchTranslation() {
		fetchJSON(`static/lang/${this.props.lang}.json`).then((translation) =>
			this.setState({translation})
		);
	}

	prepareData = () => {
		// TRANSLATE
		let data: Food[] =
			this.props.lang !== 'en' && isEmptyObject(this.state.translation)
				? this.state.data
				: Data.translateData(
						this.state.data,
						this.state.translation,
						this.props.lang
				  );

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

		this.setState({
			dataProcessed: data,
		});
	};

	debouncedPrepareData = debounce(this.prepareData, 200);

	// =================================
	// RENDER HELPERS
	// =================================
	renderAvoid = ({cellData}: {cellData?: string}) => (
		<TableIcon name={cellData ? 'error' : 'ok'} />
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
				{...(column.name === 'avoid' ? {cellRenderer: this.renderAvoid} : {})}
				{...(column.name === 'name' ? {cellRenderer: this.renderName} : {})}
			/>
		));
	}

	renderName = ({cellData}: {cellData?: string}) => (
		<div
			onClick={this.props.dispatchShowFloat.bind(this, cellData || '')}
			onMouseOver={this.props.dispatchShowFloat.bind(this, cellData || '')}
			onMouseLeave={this.props.dispatchHideFloat}
		>
			{cellData}
		</div>
	);

	// =============================
	// LIFECYCLE METHODS
	// =============================
	componentDidMount() {
		this.setState({
			isFetching: true,
		});
		this.fetchData();

		if (this.props.lang !== 'en') this.fetchTranslation();
	}

	componentDidUpdate(prevProps: Props, prevState: State) {
		// On page load, data will probably arrive AFTER the language was already set.
		// In which case, state.translation will be empty.
		if (
			this.props.lang !== 'en' &&
			(isEmptyObject(this.state.translation) ||
				this.props.lang !== prevProps.lang)
		) {
			this.fetchTranslation();
		}

		if (prevProps.filter !== this.props.filter) {
			this.debouncedPrepareData();
		} else if (
			prevState.data !== this.state.data ||
			!isEqual(prevProps, this.props)
		) {
			this.prepareData();
		}
	}

	render() {
		return this.state.isFetching ? (
			<Loading />
		) : (
			<StyledTable innerRef={this.tableRef}>
				<AutoSizer>
					{({width, height}) => (
						<Table
							// TODO: How would using to-px/browser affect this calculation?
							// Evaluate generally switching to px...
							headerHeight={3.0 * toPX('em', this.tableRef.current)}
							height={height}
							rowHeight={1.5 * toPX('em', this.tableRef.current)}
							rowGetter={({index}) => this.state.dataProcessed[index]}
							rowCount={this.state.dataProcessed.length}
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
}: ReduxState) => ({
	filter,
	lang,
	lockedAvoid,
	onlyFruit,
	showServing,
	sortBy,
	sortAsc,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
	dispatchColAction: ({
		sortBy: col,
		sortDirection,
	}: {
		sortBy: string;
		sortDirection: string;
	}) =>
		col === 'avoid'
			? dispatch(toggleLockAvoid())
			: dispatch(changeSort(col, sortDirection === SortDirection.ASC)),
	dispatchHideFloat: () => dispatch(hideFloat()),
	dispatchShowFloat: (name: string, e: React.MouseEvent<HTMLDivElement>) => {
		if (e.currentTarget.scrollWidth > e.currentTarget.clientWidth) {
			e.stopPropagation();
			dispatch(showFloat(name, e.pageX, e.pageY));
		}
	},
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(VirtualTable);
