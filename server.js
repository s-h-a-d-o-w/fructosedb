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
		return extractData((await res.json()).report.foods);
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
