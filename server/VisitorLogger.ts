import * as geoip from 'geoip-lite';
import * as mongoose from 'mongoose';

const isDev = !(process.env.NODE_ENV === 'production');

type Props = {
	VisitorModel?: any;
	ipBuffer: string[];
	reportInterval: number;
	visitorInterval: number;
};

type VisitorData = {
	time: string;
	country: string;
	region: string;
};

type Visitor = mongoose.Document &
	VisitorData &
	{
		[key in keyof VisitorData]: VisitorData[key];
	};

class VisitorLogger implements Props {
	VisitorModel?: mongoose.Model<Visitor>;
	ipBuffer: string[] = [];
	reportInterval = 7 * 24 * 60 * 60 * 1000;
	visitorInterval = 60 * 60 * 1000;

	constructor(opts?: Props) {
		if (opts) {
			this.reportInterval = opts.reportInterval || this.reportInterval;
			this.visitorInterval = opts.visitorInterval || this.visitorInterval;
		}

		mongoose.connect(
			`mongodb://fructosedb:${
				process.env.MONGODB_PW
			}@ds052978.mlab.com:52978/fructosedb${isDev ? '_dev' : ''}`,
			{useNewUrlParser: true},
			(err) => {
				if (err) console.error('MongoDB connection error:', err);
			}
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

			this.VisitorModel = mongoose.model<Visitor>(
				'VisitorModel',
				VisitorSchema
			);
		});
	}

	log(ip: string) {
		if (!this.VisitorModel) {
			console.error('No database connection!');
			return;
		}

		if (!this.ipBuffer.includes(ip)) {
			//console.log('Logging visitor:', ip);
			this.ipBuffer.push(ip);

			const geo = geoip.lookup(ip);
			this.saveVisitor({
				time: new Date().toLocaleDateString(),
				country: geo === null ? '--' : geo.country,
				region: geo === null ? '--' : geo.region,
			});

			// Requests within 1 hour are counted as one visit.
			setTimeout(() => {
				//console.log('Removing from visitor ip buffer:', this.ipBuffer.shift());
			}, this.visitorInterval);
		}
	}

	hitsPerProp(visitors: Visitor[], prop: keyof VisitorData) {
		const hitsPer: {[key: string]: number} = {};
		visitors.forEach(
			(visitor) =>
				(hitsPer[visitor[prop]] = hitsPer[visitor[prop]]
					? hitsPer[visitor[prop]] + 1
					: 1)
		);

		return hitsPer;
	}

	report() {
		return new Promise((resolve, reject) => {
			if (this.VisitorModel) {
				this.VisitorModel.find((err, visitors) => {
					if (err) {
						let generalError = 'Error generating visitor report';
						console.error(generalError, err);
						reject(generalError);
					}

					const hitsPerDay = this.hitsPerProp(visitors, 'time');
					const hitsPerCountry = this.hitsPerProp(visitors, 'country');

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
			} else {
				reject('Database connection failed.');
			}
		});
	}

	saveVisitor(visitorInfo: VisitorData) {
		if (this.VisitorModel) {
			const Visitor = new this.VisitorModel(visitorInfo);
			Visitor.save(function(error) {
				if (error) {
					console.error(error);
				}
			});
		}
	}
}

export default VisitorLogger;
