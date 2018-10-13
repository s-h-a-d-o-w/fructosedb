require('../env-config.js');

// TODO: Won't work until the following ticket is resolved:
// https://github.com/RuntimeTools/appmetrics-dash/issues/160
// const appmetrics = require('appmetrics');
// const monitoring = appmetrics.monitor();
// require('appmetrics-dash').attach({
// 	url: process.env.DASHBOARD_PATH,
// });

const path = require('path');
const next = require('next');
const express = require('express');
const compression = require('compression');
const fetchFoodsList = require('./usda.js').fetchFoodsList;

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({dev});
const handle = app.getRequestHandler();

const visitorLogger = new (require('./VisitorLogger')).VisitorLogger();

// TODO: Might want to cache SSR renderings at some point
// But first check what cache-less page load performance is like!
// https://github.com/zeit/next.js/blob/master/examples/ssr-caching/server.js

app.prepare().then(() => {
	const server = express();
	server.use(compression());

	// For visitor logging - see: https://stackoverflow.com/a/14631683/5040168
	server.enable('trust proxy');

	let cache = {};
	const updateCache = async () => {
		cache = await fetchFoodsList();
		cache.age = new Date();
		console.log(new Date().toISOString(), 'Updated cache.');
		setTimeout(updateCache, 24 * 1000 * 60 * 60);
	};

	server.get('/favicon.ico', (req, res) => {
		app.serveStatic(req, res, path.join(__dirname, 'static/favicon.ico'));
	});

	server.get('/list', (req, res) => {
		return res.json(cache);
	});

	server.get('/visitors', async (req, res) => {
		let result = await visitorLogger.report();
		return res.send(result);
	});

	server.get('*', (req, res) => {
		visitorLogger.log(req.ip);
		return handle(req, res);
	});

	updateCache().then(() => {
		server.listen(port, (err) => {
			if (err) throw err;
			console.log(
				`> ${dev ? 'Dev' : 'Prod'} ready @ ${process.env.BACKEND_URL}`
			);
		});
	});
});
