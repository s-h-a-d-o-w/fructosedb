import memoize from 'memoize-one';
import fastSort from 'fast-sort';

import {Food} from 'types';

import {Translation} from './FoodsTable';

export type HeaderDataItem = {
	description: string;
	remWidth: number;
};

type Header = HeaderDataItem & {
	name: string;
};

const headerData: {[key: string]: HeaderDataItem} = {
	name: {description: 'Name', remWidth: 0},
	avoid: {description: '', remWidth: 1.5},
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
