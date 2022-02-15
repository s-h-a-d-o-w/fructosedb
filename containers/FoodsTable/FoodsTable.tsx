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
import {AutoSizer, Table, SortDirection, Size} from 'react-virtualized';
import {Dispatch as ReduxDispatch} from 'redux';
import toPX from 'to-px';
import {useDebounce} from 'use-debounce';

import {Loading} from 'components/Loading';
import {fetchJSON} from 'lib/fetch-with-timeout';
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

  const [debouncedFilter] = useDebounce(filter, 200);

  const intl = useIntl();

  const tableRef = useRef(null);

  useEffect(function() {
    fetchURL('list', setIsFetchingRawData, setRawData);
  }, []);

  useEffect(
    function() {
      if (lang !== 'en') {
        fetchURL(
          `static/lang/${lang}.json`,
          setIsFetchingTranslation,
          setTranslation
        );
      }
    },
    [lang]
  );

  useEffect(
    function() {
      if (!isFetchingTranslation) {
        let nextData: Food[] = Data.translate(rawData, translation, lang);
        nextData = Data.sort(nextData, sortBy, sortAsc);
        nextData = Data.filter(nextData, debouncedFilter, onlyFruit);

        // If `name` is falsy, it hasn't been translated yet
        setData(nextData.filter((el) => el.name));
      }
    },
    [
      rawData,
      onlyFruit,
      translation,
      sortAsc,
      sortBy,
      lang,
      debouncedFilter,
      isFetchingTranslation,
    ]
  );

  return isFetchingRawData || isFetchingTranslation ? (
    <Loading />
  ) : (
    <StyledTable ref={tableRef}>
      <AutoSizer>
        {({width, height}: Size) => (
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

// TODO: Migrate to hooks
// Problem: dispatchHideFloat and dispatchShowFloat trigger full page "rerenders",
// even when combined with useCallback.
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
