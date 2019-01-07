import '../env-config';

// import * as appmetricsDash from 'appmetrics-dash';
// appmetricsDash.attach({
// 	// TODO: Use once a version containing the PR for the following has been published on npmjs
// 	// https://github.com/RuntimeTools/appmetrics-dash/issues/160
// 	//url: process.env.DASHBOARD_PATH,
// 	nodereport: null,
// });

import * as next from 'next';
import * as express from 'express';
import * as compression from 'compression';
import {spawn} from 'child_process';

import {setupRoutes, updateFoodCache} from './routes.js';

const port = process.env.PORT;
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
	updateFoodCache().then(() => {
		server.listen(port, (err) => {
			if (err) throw err;
			console.log(
				`> ${dev ? 'Dev' : 'Prod'} ready @ ${process.env.BACKEND_URL}`
			);

			// Build SSR cache
			setTimeout(() => spawn('curl', [process.env.BACKEND_URL]), 500);

			if ('TESTRUN' in process.env || 'TRAVIS' in process.env) {
				process.exit(0);
			}
		});
	});
});
