require('../env-config.js');

require('appmetrics-dash').attach({
	// TODO: Use once a version containing the PR for the following has been published on npmjs
	// https://github.com/RuntimeTools/appmetrics-dash/issues/160
	//url: process.env.DASHBOARD_PATH,
	nodereport: null,
});

const next = require('next');
const express = require('express');
const compression = require('compression');
const {spawn} = require('child_process');

const {setupRoutes, updateCache} = require('./routes.js');

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({dev});

// TODO: Might want to cache SSR renderings at some point
// But first check what cache-less page load performance is like!
// https://github.com/zeit/next.js/blob/master/examples/ssr-caching/server.js

// At some point, this will become Node default behavior anyway.
process.on('unhandledRejection', (reason, p) => {
	console.log('Unhandled Rejection at:', p, 'reason:', reason);
	process.exit(1);
});

app.prepare().then(() => {
	const server = express();
	server.use(compression());

	// Make it possible to get visitor's IP for logging - see VisitorLogger.
	// See: https://stackoverflow.com/a/14631683/5040168
	server.enable('trust proxy');

	setupRoutes(app, server);
	updateCache().then(() => {
		server.listen(port, (err) => {
			if (err) throw err;
			console.log(
				`> ${dev ? 'Dev' : 'Prod'} ready @ ${process.env.BACKEND_URL}`
			);

			// First page load appears to be slower than subsequent ones,
			// so trigger one on startup
			setTimeout(() => spawn('curl', [process.env.BACKEND_URL]), 500);
			// ... and try to prevent deployment from entering idle mode
			setInterval(
				() => spawn('curl', [process.env.BACKEND_URL]),
				5 * 60 * 1000
			);

			if ('TRAVIS' in process.env && 'CI' in process.env) {
				process.exit(0);
			}
		});
	});
});
