"use strict";
exports.__esModule = true;
var geoip = require('geoip-lite');
var mongoose = require('mongoose');
var isDev = !(process.env.NODE_ENV === 'production');
var VisitorLogger = /** @class */ (function () {
    function VisitorLogger(opts) {
        var _this = this;
        this.VisitorModel = null;
        this.ipBuffer = [];
        this.reportInterval = 7 * 24 * 60 * 60 * 1000;
        this.visitorInterval = 60 * 60 * 1000;
        if (opts) {
            this.reportInterval = opts.reportInterval || this.reportInterval;
            this.visitorInterval = opts.visitorInterval || this.visitorInterval;
        }
        mongoose.connect("mongodb://fructosedb:" + process.env.MONGODB_PW + "@ds052978.mlab.com:52978/fructosedb" + (isDev ? '_dev' : ''), { useNewUrlParser: true }, function (err) { return console.error('MongoDB connection error:', err); });
        var db = mongoose.connection;
        db.on('error', function (err) {
            console.error('MongoDB error', err);
            process.exit(1);
        });
        db.once('open', function () {
            console.log('MongoDB connection succeeded.');
            var VisitorSchema = new mongoose.Schema({
                time: String,
                country: String,
                region: String
            });
            _this.VisitorModel = mongoose.model('VisitorModel', VisitorSchema);
        });
    }
    VisitorLogger.prototype.log = function (ip) {
        if (this.VisitorModel === null) {
            console.error('No database connection!');
            return;
        }
        if (!this.ipBuffer.includes(ip)) {
            //console.log('Logging visitor:', ip);
            this.ipBuffer.push(ip);
            var geo = geoip.lookup(ip);
            var Visitor = new this.VisitorModel({
                time: new Date().toLocaleDateString(),
                country: geo === null ? '--' : geo.country,
                region: geo === null ? '--' : geo.region
            });
            Visitor.save(function (error) {
                if (error) {
                    console.error(error);
                }
            });
            // Requests within 1 hour are counted as one visit.
            setTimeout(function () {
                //console.log('Removing from visitor ip buffer:', this.ipBuffer.shift());
            }, this.visitorInterval);
        }
    };
    VisitorLogger.prototype.report = function () {
        var _this = this;
        if (this.VisitorModel !== null) {
            return new Promise(function (resolve, reject) {
                _this.VisitorModel.find(function (err, visitors) {
                    if (err) {
                        var generalError = 'Error generating visitor report';
                        console.error(generalError, err);
                        reject(generalError);
                    }
                    var hitsPerDay = {};
                    visitors.forEach(function (visitor) {
                        return (hitsPerDay[visitor.time] = hitsPerDay[visitor.time]
                            ? hitsPerDay[visitor.time] + 1
                            : 1);
                    });
                    var hitsPerCountry = {};
                    visitors.forEach(function (visitor) {
                        return (hitsPerCountry[visitor.country] = hitsPerCountry[visitor.country]
                            ? hitsPerCountry[visitor.country] + 1
                            : 1);
                    });
                    resolve("\n<pre>\nHits per country:\n=================\n" + JSON.stringify(hitsPerCountry, null, 2) + "\n\nHits per day:\n=============\n" + JSON.stringify(hitsPerDay, null, 2) + "\n</pre>\n");
                });
            });
        }
        else {
            return 'Database connection failed.';
        }
    };
    return VisitorLogger;
}());
exports["default"] = VisitorLogger;
