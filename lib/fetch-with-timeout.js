// if(typeof window === 'undefined')
// 	import fetch from 'isomorphic-unfetch';
// else
//
const fetch = require('isomorphic-unfetch');

module.exports = function(url, options, timeout = 5000) {
	return Promise.race([
		fetch(url, options),
		new Promise((_, reject) =>
			setTimeout(() => reject(new Error(`Request timed out: ${url}`)), timeout)
		),
	]);
};