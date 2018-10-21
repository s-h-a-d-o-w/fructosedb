import * as os from 'os-utils';
import * as path from 'path';

import VisitorLogger from './VisitorLogger';
import {fetchFoodsList} from './usda';

let foodCache: any = {};
const updateFoodCache = async () => {
	foodCache = await fetchFoodsList();
	foodCache.age = new Date();
	console.log(new Date().toISOString(), 'Updated cache.');

	// Update cache every 24h
	setTimeout(updateFoodCache, 24 * 1000 * 60 * 60);
};

const setupRoutes = (nextApp, expressServer) => {
	const visitorLogger = new VisitorLogger();
	const nextHandle = nextApp.getRequestHandler();

	expressServer.get('/favicon.ico', (req, res) => {
		return nextApp.serveStatic(
			req,
			res,
			path.join(__dirname, '../static/favicon.ico')
		);
	});

	expressServer.get('/list', (_, res) => {
		return res.json(foodCache);
	});

	expressServer.get('/health', (_, res) => {
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

	expressServer.get('/visitors', async (_, res) => {
		let result;
		try {
			result = await visitorLogger.report();
		} catch (err) {
			result = 'Error while fetching visitor information.';
		}
		return res.send(result);
	});

	expressServer.get('*', (req, res) => {
		visitorLogger.log(req.ip);
		return nextHandle(req, res);
	});
};

export {setupRoutes, updateFoodCache};
