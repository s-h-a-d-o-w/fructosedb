require('./env-config.js');

const next = require('next');
const express = require('express');
const compression = require('compression');
const querystring = require('querystring');
const fetch = require('isomorphic-unfetch');

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({dev});
const handle = app.getRequestHandler();

// TODO: Might want to cache SSR renderings at some point
// But first check what cache-less page load performance is like!
// https://github.com/zeit/next.js/blob/master/examples/ssr-caching/server.js

const nutrientPerServing = (gm, weight) => gm * weight * 0.01;

const fructoseGlucoseRatio = (fructose, sucrose, glucose) =>
	Math.round(((fructose + 0.5 * sucrose) / (glucose + 0.5 * sucrose)) * 100) /
	100;

// Format the data the way the frontend needs it
const extractData = (data) =>
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
		}));

// TODO: Do this in frontend instead, so that the user can choose?
const removeDuplicates = (data) => {
	let thresholdRatio = 0.1;
	// threshold of 5 e.g. removes apple juice, possibly of similar ratios for
	// raw apples or another apple product
	let thresholdName = 7; // number of characters that have to match
	let similar = {};

	// Find similar F/G ratios
	data = data.sort((a, b) => a.ratio - b.ratio);
	for (let i = 0; i < data.length - 1; i++) {
		let j = i + 1;

		// could also create on demand in loop below - memory use vs. runtime perf
		similar[i] = [];

		while (j < data.length && data[j].ratio - data[i].ratio < thresholdRatio) {
			similar[i].push(j);
			j++;
		}
	}

	// Find similar names among similar ratios
	let elementsToRemove = {};
	for (let key of Reflect.ownKeys(similar)) {
		if (similar[key].length > 1) {
			let firstName = data[similar[key][0]].name.substr(0, thresholdName);
			for (let i = 1; i < similar[key].length; i++) {
				if (firstName === data[similar[key][i]].name.substr(0, thresholdName))
					elementsToRemove[similar[key][i]] = null;
			}
		}
	}

	let sortedIndices = Reflect.ownKeys(elementsToRemove)
		.map((idx) => parseInt(idx, 10))
		.sort((a, b) => a - b);
	console.log(`Removing ${sortedIndices.length} of ${data.length} items`);
	for (let i = sortedIndices.length - 1; i >= 0; i--) {
		data.splice(sortedIndices[i], 1);
	}
	console.log(sortedIndices);

	return data;
};

async function getList() {
	//const dbURL = 'https://api.github.com/repos/zeit/next.js';

	// TODO: Put api key into some file that won't be committed!
	const query = querystring.stringify({
		api_key: 'ZQx4MlSQ3W8PeWVDfS5YxwLjVV1huzf7gz0rdIsV',
		nutrients: [210, 211, 212],
		max: 1500, // number of elements to return. default: 50
	});
	const dbURL = `http://api.nal.usda.gov/ndb/nutrients/?${query}`;
	const res = await fetch(dbURL);

	if (res.status === 200) {
		//return extractData((await res.json()).report.foods);
		return removeDuplicates(extractData((await res.json()).report.foods));
	} else {
		throw `Contacting ${dbURL} failed! (code: ${res.status}`;
	}
}

app.prepare().then(() => {
	const server = express();
	server.use(compression());

	let cache = {};
	const updateCache = async () => {
		cache = await getList();
		cache.age = new Date();
		console.log(new Date().toISOString(), 'Updated cache.');
		setTimeout(updateCache, 24 * 1000 * 60 * 60);
	};

	server.get('/list', (req, res) => {
		return res.json(cache);
	});

	server.get('*', (req, res) => {
		return handle(req, res);
	});

	updateCache().then(() => {
		server.listen(port, (err) => {
			if (err) throw err;
			console.log(`> Ready on http://localhost:${port}`);
		});
	});
});
