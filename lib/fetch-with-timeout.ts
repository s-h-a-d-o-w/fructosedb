const fetch = require('isomorphic-unfetch');

export default (url: string, options?: object, timeout: number = 5000) =>
	Promise.race([
		fetch(url, options),
		new Promise((_, reject) =>
			setTimeout(() => reject(new Error(`Request timed out: ${url}`)), timeout)
		),
	]);
