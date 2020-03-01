const isomorphicFetch: typeof fetch = require('isomorphic-unfetch');

async function fetchJSON(url: string, options?: object, timeout = 5000) {
  const res = await fetchWithTimeout(url, options, timeout);

  if (res.status === 200) {
    return await res.json();
  } else {
    throw `${res.status} ${url}: ${res.statusText}`;
  }
}

const fetchWithTimeout = (url: string, options?: object, timeout = 5000) =>
  Promise.race<Promise<Response>>([
    isomorphicFetch(url, options),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error(`Request timed out: ${url}`)), timeout)
    ),
  ]);

export {fetchWithTimeout as fetch, fetchJSON};
