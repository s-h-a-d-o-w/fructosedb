import memoize from 'memoize-one';
import fastSort from 'fast-sort';

import {Food} from 'types';

import {Translation} from './FoodsTable';

export type HeaderDataItem = {
  remWidth: number;
};

type Header = HeaderDataItem & {
  name: string;
};

const headerData: {[key: string]: HeaderDataItem} = {
  name: {remWidth: 0},
  avoid: {remWidth: 1.5},
  measure: {
    remWidth: 4,
  },
  fructose: {
    remWidth: 4.5,
  },
  sucrose: {
    remWidth: 4.5,
  },
  glucose: {
    remWidth: 4.5,
  },
  fructoseServing: {
    remWidth: 4.5,
  },
  sucroseServing: {
    remWidth: 4.5,
  },
  glucoseServing: {
    remWidth: 4.5,
  },
  ratio: {
    remWidth: 3.5,
  },
};

const filter = memoize((data: Food[], term: string, onlyFruit: boolean) => {
  let nextData = data.slice();

  if (term !== '') {
    nextData = nextData.filter(
      (el) => el.name.toLowerCase().indexOf(term.toLowerCase()) >= 0
    );
  }
  if (onlyFruit) {
    nextData = nextData.filter((el) => el.isFruit);
  }

  return nextData;
});

const generateHeaders = (cols: string[]): Header[] =>
  cols.map((col) => Object.assign({}, headerData[col], {name: col}));

const sort = memoize((data: Food[], sortBy: string, sortAsc: boolean) =>
  sortAsc
    ? fastSort(data.slice()).asc(sortBy)
    : fastSort(data.slice()).desc(sortBy)
);

const translate = memoize(
  (data: Food[], translation: Translation, lang: string): Food[] =>
    lang === 'en'
      ? data
      : data.map((el) => Object.assign({}, el, {name: translation[el.name]}))
);

export {filter, generateHeaders, sort, translate};
