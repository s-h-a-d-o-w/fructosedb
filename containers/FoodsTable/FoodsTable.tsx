import * as React from 'react';
import {
	useEffect,
	useRef,
	useState,
	Dispatch as ReactDispatch,
	SetStateAction,
} from 'react';
import {useIntl} from 'react-intl';
import {connect} from 'react-redux';
import {AutoSizer, Table, SortDirection} from 'react-virtualized';
import {Dispatch as ReduxDispatch} from 'redux';
import toPX from 'to-px';
import {useDebouncedCallback} from 'use-debounce';

import {Loading} from 'components/Loading';
import {fetchJSON} from 'lib/fetch-with-timeout';
import {isEmptyObject} from 'lib/util';
import {changeSort, showFloat, hideFloat} from 'store/actions';
import {ReduxState} from 'store';
import {Food} from 'types';

import StyledTable from './style';
import * as Data from './data';
import {renderColumns} from './renderers';

export type Props = ReturnType<typeof mapStateToProps> &
	ReturnType<typeof mapDispatchToProps>;

export type Translation = {[key: string]: string};

function fetchURL(
	url: string,
	setIsFetching: ReactDispatch<SetStateAction<boolean>>,
	setFetchResult:
		| ReactDispatch<SetStateAction<Food[]>>
		| ReactDispatch<SetStateAction<Translation>>
) {
	setIsFetching(true);
	fetchJSON(url).then((payload) => {
		setFetchResult(payload);
		setIsFetching(false);
	});
}

const _FoodsTable: React.FC<Props> = ({
	dispatchColAction,
	dispatchHideFloat,
	dispatchShowFloat,
	filter,
	lang,
	onlyFruit,
	showServingSize,
	sortAsc,
	sortBy,
}) => {
	const [isFetchingRawData, setIsFetchingRawData] = useState(false);
	const [isFetchingTranslation, setIsFetchingTranslation] = useState(false);
	const [rawData, setRawData] = useState<Food[]>([]);
	const [data, setData] = useState<Food[]>([]);
	const [translation, setTranslation] = useState<Translation>({});

	const intl = useIntl();

	const tableRef = useRef(null);

	useEffect(function() {
		fetchURL('list', setIsFetchingRawData, setRawData);
	}, []);

	// Debounced data preparation here instead of debouncing the filter input,
	// since synchronizing local and global state for the input field would be
	// excessive overhead for a small app like this.
	useEffect(
		function() {
			debouncedUpdateData();
		},
		[filter]
	);

	useEffect(
		function() {
			if (!isFetchingTranslation) {
				console.log('fetching lang', lang);
				if (lang !== 'en') {
					fetchURL(
						`static/lang/${lang}.json`,
						setIsFetchingTranslation,
						setTranslation
					);
				} else {
					// 'translation' effect hook won't be triggered,
					// so we have to trigger the data update here.
					updateData();
				}
			}
		},
		[lang]
	);

	useEffect(
		function() {
			updateData();
		},
		[rawData, onlyFruit, translation, sortAsc, sortBy]
	);

	function updateData() {
		let nextData: Food[] =
			lang !== 'en' && isEmptyObject(translation)
				? [] // in case translation fetch isn't done yet
				: Data.translate(rawData, translation, lang);
		nextData = Data.sort(nextData, sortBy, sortAsc);
		nextData = Data.filter(nextData, filter, onlyFruit);

		setData(nextData);
	}

	const [debouncedUpdateData] = useDebouncedCallback(updateData, 200);

	return isFetchingRawData || isFetchingTranslation ? (
		<Loading />
	) : (
		<StyledTable ref={tableRef}>
			<AutoSizer>
				{({width, height}) => (
					<Table
						// TODO: How would using to-px/browser affect this calculation?
						// Evaluate generally switching to px...
						headerHeight={3.0 * toPX('em', tableRef.current)}
						height={height}
						rowHeight={1.5 * toPX('em', tableRef.current)}
						rowGetter={({index}) => data[index]}
						rowCount={data.length}
						sort={dispatchColAction}
						sortBy={sortBy}
						sortDirection={sortAsc ? SortDirection.ASC : SortDirection.DESC}
						width={width}
					>
						{renderColumns({
							dispatchHideFloat,
							dispatchShowFloat,
							intl,
							showServingSize,
						})}
					</Table>
				)}
			</AutoSizer>
		</StyledTable>
	);
};

const mapStateToProps = ({
	filter,
	lang,
	onlyFruit,
	showServingSize,
	sortBy,
	sortAsc,
}: ReduxState) => ({
	filter,
	lang,
	onlyFruit,
	showServingSize,
	sortBy,
	sortAsc,
});

const mapDispatchToProps = (dispatch: ReduxDispatch) => ({
	dispatchColAction: ({
		sortBy: col,
		sortDirection,
	}: {
		sortBy: string;
		sortDirection: string;
	}) =>
		col === 'avoid'
			? () => {}
			: dispatch(changeSort(col, sortDirection === SortDirection.ASC)),
	dispatchHideFloat: () => dispatch(hideFloat()),
	dispatchShowFloat: (name: string, e: React.MouseEvent<HTMLDivElement>) => {
		if (e.currentTarget.scrollWidth > e.currentTarget.clientWidth) {
			e.stopPropagation();
			dispatch(showFloat(name, e.pageX, e.pageY));
		}
	},
});

export const FoodsTable = connect(
	mapStateToProps,
	mapDispatchToProps
)(_FoodsTable);
