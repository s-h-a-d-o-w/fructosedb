import memoize from 'memoize-one';
import sort from 'fast-sort';

import {Food} from 'types';

export type HeaderDataItem = {
	description: string;
	remWidth: number;
};

type Header = HeaderDataItem & {
	name: string;
};

const headerData: {[key: string]: HeaderDataItem} = {
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

const generateHeaders = (cols: string[], lockedAvoid: boolean): Header[] =>
	cols.map((col) =>
		Object.assign(
			{},
			headerData[col],
			{name: col},
			col === 'avoid'
				? lockedAvoid
					? {description: '🔒'}
					: {description: '🔓'}
				: {}
		)
	);

const sortData = memoize(
	(data: Food[], sortBy: string, sortAsc: boolean, lockedAvoid: boolean) => {
		let sortCriteria = [];

		if (lockedAvoid) {
			sortCriteria.push({desc: 'avoid'});
		}
		sortCriteria.push(sortAsc ? {asc: sortBy} : {desc: sortBy});

		return sort(data).by(sortCriteria);
	}
);

const translateData = memoize(
	(data: Food[], translation: {[key: string]: string}, lang: string): Food[] =>
		lang === 'en'
			? data
			: data.map((el) => Object.assign({}, el, {name: translation[el.name]}))
);

export {generateHeaders, sortData, translateData};
