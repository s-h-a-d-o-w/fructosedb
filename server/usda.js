const querystring = require('querystring');
const fetch = require('../lib/fetch-with-timeout.js');

const nutrientPerServing = (gm, weight) => Math.round(gm * weight) / 100;
const fructoseGlucoseRatio = (fructose, sucrose, glucose) =>
	Math.round(((fructose + 0.5 * sucrose) / (glucose + 0.5 * sucrose)) * 100) /
	100;

// See: https://www.foodsmatter.com/miscellaneous_articles/sugar_sweeteners/articles/fructose-intol-joneja-09-14.html
const avoid = (serving, fructose, sucrose, glucose) => {
	// Fructose should not exceed glucose by more than 0.5/100g
	let relative = fructose + 0.5 * sucrose - (glucose + 0.5 * sucrose) > 0.5;
	// No more than 3g per serving (we of course have to estimate based on what
	// the USDA says the serving size is)
	let absolute = (serving / 100) * fructose > 3;

	return relative || absolute;
};

// Format the data the way the frontend needs it.
// Discard items that don't contain all needed nutrient info.
const transformData = (data, fruitIDs) =>
	data
		.filter(
			(el) =>
				el.nutrients[2].gm !== '--' &&
				el.nutrients[0].gm !== '--' &&
				el.nutrients[1].gm !== '--'
		)
		.map(({ndbno, name, weight, measure, nutrients}) => ({
			ndbno,
			name,
			weight,
			measure,
			fructose: nutrients[2].gm,
			sucrose: nutrients[0].gm,
			glucose: nutrients[1].gm,
			fructoseServing: nutrientPerServing(nutrients[2].gm, weight),
			sucroseServing: nutrientPerServing(nutrients[0].gm, weight),
			glucoseServing: nutrientPerServing(nutrients[1].gm, weight),
			ratio: fructoseGlucoseRatio(
				nutrients[2].gm,
				nutrients[0].gm,
				nutrients[1].gm
			),
			avoid: avoid(weight, nutrients[2].gm, nutrients[0].gm, nutrients[1].gm),
			isFruit: fruitIDs.includes(ndbno),
		}));

async function getFruitIDs() {
	// For food group ID see: https://api.nal.usda.gov/ndb/list?format=json&lt=g&sort=n&api_key=DEMO_KEY
	const foods = (await getReport(1500, 0, '0900')).foods;
	const ids = [];
	foods.forEach((el) => ids.push(el.ndbno));
	return ids;
}

async function getReport(max = 1, offset = 0, fg = '') {
	const query = querystring.stringify({
		api_key: process.env.USDA_KEY,
		nutrients: [210, 211, 212],
		max, // number of elements to return. default: 50
		offset,
		fg, // food group (used for figuring out which are fruits)
	});
	const dbURL = `http://api.nal.usda.gov/ndb/nutrients/?${query}`;
	const res = await fetch(dbURL);

	if (res.status === 200) {
		return (await res.json()).report;
	} else {
		throw `Contacting ${dbURL} failed! (code: ${res.status}`;
	}
}

// Get full list of foods from the USDA DB.
// Data rearranged as needed by the frontend. (see transformData())
async function fetchFoodsList() {
	// Included food groups.
	// Only 10 can be specified at once!
	// See also: https://api.nal.usda.gov/ndb/list?format=json&lt=g&sort=n&api_key=DEMO_KEY
	// prettier-ignore
	let foodGroups = [
		['3500', '1800', '1300', '1400', '0800', '2000', '0100', '1500', '0900', '1700'],
		['1600', '2200', '1200', '1000', '0500', '0700', '2500', '0200', '1900', '1100']
	];

	let data = [];
	for (let fg of foodGroups) {
		// Dummy report fetch gives us total number of foods
		let total = (await getReport(1, 0, fg)).total;

		for (let offset = 0; offset < total; offset += 1500) {
			let report = await getReport(1500, offset, fg);
			data = data.concat(report.foods);
		}
	}

	return removeSimilar(transformData(data, await getFruitIDs()));
}

/**
 * Removes unnecessary items by first grouping items with similar F/G ratios, then
 * comparing their names.
 * For instance - if a given food has the same F/G ratio when raw vs. when cooked, there
 * is no need to list it twice.
 * @param {Object[]} data
 * @returns {Object[]}
 */
const removeSimilar = (data) => {
	let thresholdRatio = 0.1;
	let thresholdFructose = 1;
	// Threshold of 5 e.g. removes apple juices -> too short
	let thresholdName = 7; // number of characters that have to match
	let similar = {};

	// Find similar F/G ratios
	data = data.sort((a, b) => a.ratio - b.ratio);
	for (let i = 0; i < data.length - 1; i++) {
		// Could also create on demand in loop below - memory use vs. runtime perf
		similar[i] = [];

		for (
			let j = i + 1;
			j < data.length && data[j].ratio - data[i].ratio < thresholdRatio;
			j++
		) {
			// Amount of fructose being too different is also an important factor
			if (Math.abs(data[i].fructose - data[j].fructose) < thresholdFructose) {
				similar[i].push(j);
			}
		}
	}

	// Find similar names among similar ratios
	let elementsToRemove = {};
	Reflect.ownKeys(similar).forEach((idx) => {
		if (similar[idx].length > 0) {
			const nameBeginning = data[idx].name.substr(0, thresholdName);
			similar[idx].forEach((innerIdx) => {
				if (nameBeginning === data[innerIdx].name.substr(0, thresholdName))
					elementsToRemove[innerIdx] = null;
			});
		}
	});

	// Actually remove the likely duplicates
	let sortedIndices = Reflect.ownKeys(elementsToRemove)
		.map((idx) => parseInt(idx, 10))
		.sort((a, b) => a - b);

	console.log(
		`Removing ${sortedIndices.length} similar items from ${
			data.length
		} in total`
	);

	for (let i = sortedIndices.length - 1; i >= 0; i--)
		data.splice(sortedIndices[i], 1);

	return data;
};

module.exports = {
	fetchFoodsList,
};
