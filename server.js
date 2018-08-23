require('./env-config.js');

const next = require('next');
const express = require('express');
const querystring = require('querystring');
const fetch = require('isomorphic-unfetch');

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({dev});
const handle = app.getRequestHandler();

// TODO: Might want to cache SSR renderings at some point
// But first check what cache-less page load performance is like!
// https://github.com/zeit/next.js/blob/master/examples/ssr-caching/server.js

// Format the data the way the frontend needs it
const extractData = (data) =>
	data
		.map(({ndbno, name, weight, measure, nutrients}) => ({
			ndbno,
			name,
			weight,
			measure,
			fructose: nutrients[2].gm,
			sucrose: nutrients[0].gm,
			glucose: nutrients[1].gm,
			fructoseMeasure: nutrients[2].gm * weight * 0.01,
			sucroseMeasure: nutrients[0].gm * weight * 0.01,
			glucoseMeasure: nutrients[1].gm * weight * 0.01,
		}))
		.filter(
			(el) =>
				(el.fructose !== 0 && el.fructose !== '--') ||
				(el.glucose !== 0 && el.glucose !== '--')
		);

async function getList() {
	//const dbURL = 'https://api.github.com/repos/zeit/next.js';

	// TODO: Put api key into some file that won't be committed!
	const query = querystring.stringify({
		api_key: 'ZQx4MlSQ3W8PeWVDfS5YxwLjVV1huzf7gz0rdIsV',
		nutrients: [210, 211, 212],
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
