const VisitorLogger = require('./VisitorLogger');

module.exports = {
	setupRoutes: (nextApp, expressServer) => {
		const visitorLogger = new VisitorLogger();
		const nextHandle = nextApp.getRequestHandler();

		expressServer.get('/favicon.ico', (req, res) => {
			return app.serveStatic(
				req,
				res,
				path.join(__dirname, '../static/favicon.ico')
			);
		});

		expressServer.get('/list', (req, res) => {
			return res.json(cache);
		});

		expressServer.get('/health', (req, res) => {
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

		expressServer.get('/visitors', async (req, res) => {
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
	},
};