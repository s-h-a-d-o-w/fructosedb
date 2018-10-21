"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
exports.__esModule = true;
var os = require("os-utils");
var path = require("path");
var VisitorLogger_1 = require("./VisitorLogger");
var usda_1 = require("./usda");
var foodCache = {};
var updateFoodCache = function () { return __awaiter(_this, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, usda_1.fetchFoodsList()];
            case 1:
                foodCache = _a.sent();
                foodCache.age = new Date();
                console.log(new Date().toISOString(), 'Updated cache.');
                // Update cache every 24h
                setTimeout(updateFoodCache, 24 * 1000 * 60 * 60);
                return [2 /*return*/];
        }
    });
}); };
exports.updateFoodCache = updateFoodCache;
var setupRoutes = function (nextApp, expressServer) {
    var visitorLogger = new VisitorLogger_1["default"]();
    var nextHandle = nextApp.getRequestHandler();
    expressServer.get('/favicon.ico', function (req, res) {
        return nextApp.serveStatic(req, res, path.join(__dirname, '../static/favicon.ico'));
    });
    expressServer.get('/list', function (_, res) {
        return res.json(foodCache);
    });
    expressServer.get('/health', function (_, res) {
        return res.send("\n<pre>\nPlatform: " + os.platform() + "\nCPUs: " + os.cpuCount() + "\nFree Mem: " + os.freemem() + "\nTotal Mem: " + os.totalmem() + "\nFree Mem %: " + os.freememPercentage() + "\nSys uptime: " + os.sysUptime() + "\nProc uptime: " + os.processUptime() + "\n\nCPU Load 1 min: " + os.loadavg(1) + "\nCPU Load 5 min: " + os.loadavg(5) + "\nCPU Load 15 min: " + os.loadavg(15) + "\n</pre>\n");
    });
    expressServer.get('/visitors', function (_, res) { return __awaiter(_this, void 0, void 0, function () {
        var result, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, visitorLogger.report()];
                case 1:
                    result = _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    err_1 = _a.sent();
                    result = 'Error while fetching visitor information.';
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/, res.send(result)];
            }
        });
    }); });
    expressServer.get('*', function (req, res) {
        visitorLogger.log(req.ip);
        return nextHandle(req, res);
    });
};
exports.setupRoutes = setupRoutes;
