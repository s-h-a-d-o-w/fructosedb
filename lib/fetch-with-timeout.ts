const isomorphicFetch = require('isomorphic-unfetch');

const fetch = (url: string, options?: object, timeout: number = 5000) =>
	Promise.race([
		isomorphicFetch(url, options),
		new Promise((_, reject) =>
			setTimeout(() => reject(new Error(`Request timed out: ${url}`)), timeout)
		),
	]);

async function fetchJSON(
	url: string,
	options?: object,
	timeout: number = 5000
) {
	const res = await fetch(url, options, timeout);
	return res.json();
}

export {fetch, fetchJSON};
