import * as os from 'os-utils';
import * as path from 'path';
import * as LRUCache from 'lru-cache';

import VisitorLogger from './VisitorLogger';
import {fetchFoodsList, Food} from './usda';

const dev = process.env.NODE_ENV !== 'production';

// ==================================
// USDA data cache (refresh interval: 24h)
// ==================================
interface FoodCache extends Array<Food> {
	age?: Date;
}

let foodCache: FoodCache = [];
const updateFoodCache = async () => {
	foodCache = await fetchFoodsList();
	foodCache.age = new Date();
	console.log(foodCache.age.toISOString(), 'Updated cache.');

	// Update cache every 24h
	setTimeout(updateFoodCache, 24 * 1000 * 60 * 60);
};
// ==================================

// ==================================
// SSR CACHE
// ==================================
// See https://github.com/zeit/next.js/blob/master/examples/ssr-caching/server.js
const ssrCache = new LRUCache({
	max: 100,
	maxAge: 1000 * 60 * 60, // 1 hour
});

async function renderAndCache(app, req, res, pagePath, queryParams?) {
	const key = req.url;

	// If we have a page in the cache, let's serve it
	if (ssrCache.has(key)) {
		res.setHeader('x-cache', 'HIT');
		res.send(ssrCache.get(key));
		return;
	}

	try {
		// If not let's render the page into HTML
		const html = await app.renderToHTML(req, res, pagePath, queryParams);

		// Something is wrong with the request, let's skip the cache
		if (res.statusCode !== 200) {
			res.send(html);
			return;
		}

		// Let's cache this page
		ssrCache.set(key, html);

		res.setHeader('x-cache', 'MISS');
		res.send(html);
	} catch (err) {
		app.renderError(err, req, res, pagePath, queryParams);
	}
}
// ==================================

// ==================================
// HELPERS
// ==================================
const renderServerHealth = () =>
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
`;
// ==================================

// ==================================
// ROUTES
// ==================================
const setupRoutes = (nextApp, expressServer) => {
	const visitorLogger = new VisitorLogger();
	const nextHandle = nextApp.getRequestHandler();

	expressServer.get('/', (req, res) => {
		visitorLogger.log(req.ip);
		return dev ? nextHandle(req, res) : renderAndCache(nextApp, req, res, '/');
	});

	expressServer.get('/list', (_, res) => {
		return res.json(foodCache);
	});

	expressServer.get('/health', (_, res) => {
		return res.send(renderServerHealth());
	});

	expressServer.get('/visitors', async (_, res) => {
		let result;
		try {
			result = await visitorLogger.report();
		} catch (err) {
			result = 'Error while fetching visitor information.';
		}
		return res.send(result);
	});

	expressServer.get('/favicon.ico', (req, res) => {
		return nextApp.serveStatic(
			req,
			res,
			path.join(__dirname, '../static/favicon.ico')
		);
	});

	expressServer.get('*', (req, res) => {
		return nextHandle(req, res);
	});
};
// ==================================

export {setupRoutes, updateFoodCache};
