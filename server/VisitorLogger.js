const geoip = require('geoip-lite');
const mongoose = require('mongoose');

const isDev = !(process.env.NODE_ENV === 'production');

class VisitorLogger {
	constructor(opts) {
		opts = Object.assign(
			{
				reportInterval: 7 * 24 * 60 * 60 * 1000,
				visitorInterval: 60 * 60 * 1000,
			},
			opts
		);

		this.VisitorModel = null;
		this.ipBuffer = [];
		this.reportInterval = opts.reportInterval;
		this.visitorInterval = opts.visitorInterval;

		mongoose.connect(
			`mongodb://fructosedb:${
				process.env.MONGODB_PW
			}@ds052978.mlab.com:52978/fructosedb${isDev ? '_dev' : ''}`,
			{useNewUrlParser: true},
			(err) => console.error('MongoDB connection error:', err)
		);

		const db = mongoose.connection;
		db.on('error', (err) => {
			console.error('MongoDB error', err);
			process.exit(1);
		});
		db.once('open', () => {
			console.log('MongoDB connection succeeded.');

			let VisitorSchema = new mongoose.Schema({
				time: String,
				country: String,
				region: String,
			});

			this.VisitorModel = mongoose.model('VisitorModel', VisitorSchema);
		});
	}

	log(ip) {
		if (this.VisitorModel === null) {
			console.error('No database connection!');
			return;
		}

		if (!this.ipBuffer.includes(ip)) {
			//console.log('Logging visitor:', ip);
			this.ipBuffer.push(ip);

			const geo = geoip.lookup(ip);
			const Visitor = new this.VisitorModel({
				time: new Date().toLocaleDateString(),
				country: geo === null ? '--' : geo.country,
				region: geo === null ? '--' : geo.region,
			});
			Visitor.save(function(error) {
				if (error) {
					console.error(error);
				}
			});

			// Requests within 1 hour are counted as one visit.
			setTimeout(() => {
				//console.log('Removing from visitor ip buffer:', this.ipBuffer.shift());
			}, this.visitorInterval);
		}
	}

	report() {
		if (this.VisitorModel !== null) {
			return new Promise((resolve) => {
				this.VisitorModel.find((err, visitors) => {
					if (err) {
						let generalError = 'Error generating visitor report';
						console.error(generalError, err);
						resolve(generalError);
					}

					const hitsPerDay = {};
					visitors.forEach(
						(visitor) =>
							(hitsPerDay[visitor.time] = hitsPerDay[visitor.time]
								? hitsPerDay[visitor.time] + 1
								: 1)
					);

					const hitsPerCountry = {};
					visitors.forEach(
						(visitor) =>
							(hitsPerCountry[visitor.country] = hitsPerCountry[visitor.country]
								? hitsPerCountry[visitor.country] + 1
								: 1)
					);

					resolve(
						`
<pre>
Hits per country:
=================
${JSON.stringify(hitsPerCountry, null, 2)}

Hits per day:
=============
${JSON.stringify(hitsPerDay, null, 2)}
</pre>
`
					);
				});
			});
		} else {
			return 'Database connection failed.';
		}
	}
}

module.exports = {
	VisitorLogger,
};
