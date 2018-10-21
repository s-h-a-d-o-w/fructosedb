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
exports.__esModule = true;
var querystring = require("querystring");
var fetch_with_timeout_1 = require("../lib/fetch-with-timeout");
var nutrientPerServing = function (gm, weight) { return Math.round(gm * weight) / 100; };
var fructoseGlucoseRatio = function (fructose, sucrose, glucose) {
    return Math.round(((fructose + 0.5 * sucrose) / (glucose + 0.5 * sucrose)) * 100) /
        100;
};
// See: https://www.foodsmatter.com/miscellaneous_articles/sugar_sweeteners/articles/fructose-intol-joneja-09-14.html
var avoid = function (serving, fructose, sucrose, glucose) {
    // Fructose should not exceed glucose by more than 0.5/100g
    var relative = fructose + 0.5 * sucrose - (glucose + 0.5 * sucrose) > 0.5;
    // No more than 3g per serving (we of course have to estimate based on what
    // the USDA says the serving size is)
    var absolute = (serving / 100) * fructose > 3;
    return relative || absolute;
};
// Format the data the way the frontend needs it.
// Discard items that don't contain all needed nutrient info.
var transformData = function (data, fruitIDs) {
    return data
        .filter(function (el) {
        return el.nutrients[2].gm !== '--' &&
            el.nutrients[0].gm !== '--' &&
            el.nutrients[1].gm !== '--';
    })
        .map(function (_a) {
        var ndbno = _a.ndbno, name = _a.name, weight = _a.weight, measure = _a.measure, nutrients = _a.nutrients;
        return ({
            ndbno: ndbno,
            name: name,
            weight: weight,
            measure: measure,
            fructose: nutrients[2].gm,
            sucrose: nutrients[0].gm,
            glucose: nutrients[1].gm,
            fructoseServing: nutrientPerServing(nutrients[2].gm, weight),
            sucroseServing: nutrientPerServing(nutrients[0].gm, weight),
            glucoseServing: nutrientPerServing(nutrients[1].gm, weight),
            ratio: fructoseGlucoseRatio(nutrients[2].gm, nutrients[0].gm, nutrients[1].gm),
            avoid: avoid(weight, nutrients[2].gm, nutrients[0].gm, nutrients[1].gm),
            isFruit: fruitIDs.includes(ndbno)
        });
    });
};
function getFruitIDs() {
    return __awaiter(this, void 0, void 0, function () {
        var foods, ids;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getReport(1500, 0, '0900')];
                case 1:
                    foods = (_a.sent()).foods;
                    ids = [];
                    foods.forEach(function (el) { return ids.push(el.ndbno); });
                    return [2 /*return*/, ids];
            }
        });
    });
}
function getReport(max, offset, fg) {
    if (max === void 0) { max = 1; }
    if (offset === void 0) { offset = 0; }
    if (fg === void 0) { fg = ''; }
    return __awaiter(this, void 0, void 0, function () {
        var query, dbURL, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    query = querystring.stringify({
                        api_key: process.env.USDA_KEY,
                        nutrients: [210, 211, 212],
                        max: max,
                        offset: offset,
                        fg: fg
                    });
                    dbURL = "http://api.nal.usda.gov/ndb/nutrients/?" + query;
                    return [4 /*yield*/, fetch_with_timeout_1["default"](dbURL)];
                case 1:
                    res = _a.sent();
                    if (!(res.status === 200)) return [3 /*break*/, 3];
                    return [4 /*yield*/, res.json()];
                case 2: return [2 /*return*/, (_a.sent()).report];
                case 3: throw "Contacting " + dbURL + " failed! (code: " + res.status;
            }
        });
    });
}
// Get full list of foods from the USDA DB.
// Data rearranged as needed by the frontend. (see transformData())
function fetchFoodsList() {
    return __awaiter(this, void 0, void 0, function () {
        var foodGroups, data, _i, foodGroups_1, fg, total, offset, report, _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    foodGroups = [
                        ['3500', '1800', '1300', '1400', '0800', '2000', '0100', '1500', '0900', '1700'],
                        ['1600', '2200', '1200', '1000', '0500', '0700', '2500', '0200', '1900', '1100']
                    ];
                    data = [];
                    _i = 0, foodGroups_1 = foodGroups;
                    _d.label = 1;
                case 1:
                    if (!(_i < foodGroups_1.length)) return [3 /*break*/, 7];
                    fg = foodGroups_1[_i];
                    return [4 /*yield*/, getReport(1, 0, fg)];
                case 2:
                    total = (_d.sent()).total;
                    offset = 0;
                    _d.label = 3;
                case 3:
                    if (!(offset < total)) return [3 /*break*/, 6];
                    return [4 /*yield*/, getReport(1500, offset, fg)];
                case 4:
                    report = _d.sent();
                    data = data.concat(report.foods);
                    _d.label = 5;
                case 5:
                    offset += 1500;
                    return [3 /*break*/, 3];
                case 6:
                    _i++;
                    return [3 /*break*/, 1];
                case 7:
                    _a = removeSimilar;
                    _b = transformData;
                    _c = [data];
                    return [4 /*yield*/, getFruitIDs()];
                case 8: return [2 /*return*/, _a.apply(void 0, [_b.apply(void 0, _c.concat([_d.sent()]))])];
            }
        });
    });
}
exports.fetchFoodsList = fetchFoodsList;
/**
 * Removes unnecessary items by first grouping items with similar F/G ratios, then
 * comparing their names.
 * For instance - if a given food has the same F/G ratio when raw vs. when cooked, there
 * is no need to list it twice.
 * @param {Object[]} data
 * @returns {Object[]}
 */
var removeSimilar = function (data) {
    var thresholdRatio = 0.1;
    var thresholdFructose = 1;
    // Threshold of 5 e.g. removes apple juices -> too short
    var thresholdName = 7; // number of characters that have to match
    var similar = {};
    // Find similar F/G ratios
    data = data.sort(function (a, b) { return a.ratio - b.ratio; });
    for (var i = 0; i < data.length - 1; i++) {
        // Could also create on demand in loop below - memory use vs. runtime perf
        similar[i] = [];
        for (var j = i + 1; j < data.length && data[j].ratio - data[i].ratio < thresholdRatio; j++) {
            // Amount of fructose being too different is also an important factor
            if (Math.abs(data[i].fructose - data[j].fructose) < thresholdFructose) {
                similar[i].push(j);
            }
        }
    }
    // Find similar names among similar ratios
    var elementsToRemove = {};
    Reflect.ownKeys(similar).forEach(function (idx) {
        if (similar[idx].length > 0) {
            var nameBeginning_1 = data[idx].name.substr(0, thresholdName);
            similar[idx].forEach(function (innerIdx) {
                if (nameBeginning_1 === data[innerIdx].name.substr(0, thresholdName))
                    elementsToRemove[innerIdx] = null;
            });
        }
    });
    // Actually remove the likely duplicates
    var sortedIndices = Reflect.ownKeys(elementsToRemove)
        .map(function (idx) { return parseInt(idx, 10); })
        .sort(function (a, b) { return a - b; });
    console.log("Removing " + sortedIndices.length + " similar items from " + data.length + " in total");
    for (var i = sortedIndices.length - 1; i >= 0; i--)
        data.splice(sortedIndices[i], 1);
    return data;
};
