require('../env-config.js');

require('appmetrics-dash').attach({
	// TODO: Use once a version containing the PR for the following has been published on npmjs
	// https://github.com/RuntimeTools/appmetrics-dash/issues/160
	//url: process.env.DASHBOARD_PATH,
	nodereport: null,
});

const path = require('path');
const next = require('next');
const express = require('express');
const compression = require('compression');
const os = require('os-utils');
const {spawn} = require('child_process');

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

	server.get('/health', (req, res) => {
		return res.send(
			`
<pre>
Platform: ${os.platform()}
CPUs: ${os.cpuCount()}
Free Mem: ${os.freemem()}
Total Mem: ${os.totalmem()}
Free Mem %: ${os.freememPercentage()}
Sys uptime: ${os.sysUptime()}
Proc uptime: ${os.processUptime()}

CPU Load 1 min: ${os.loadavg(1)}
CPU Load 5 min: ${os.loadavg(5)}
CPU Load 15 min: ${os.loadavg(15)}
</pre>
`
		);
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

			// Create SSR cache
			setTimeout(() => spawn('curl', [process.env.BACKEND_URL]), 500);
			// ... and make sure deployment never enters idle mode
			setInterval(() => spawn('curl', [process.env.BACKEND_URL]), 5 * 60 * 1000);
		});
	});
});
