"use strict";
exports.__esModule = true;
var fetch = require('isomorphic-unfetch');
exports["default"] = (function (url, options, timeout) {
    if (timeout === void 0) { timeout = 5000; }
    return Promise.race([
        fetch(url, options),
        new Promise(function (_, reject) {
            return setTimeout(function () { return reject(new Error("Request timed out: " + url)); }, timeout);
        }),
    ]);
});
