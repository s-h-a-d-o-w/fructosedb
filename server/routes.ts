import * as Express from 'express';
import * as os from 'os-utils';
import * as path from 'path';
import * as LRUCache from 'lru-cache';

import {FoodCache} from '../types';
import {fetchFoodsList} from './usda';

const isDev = process.env.NODE_ENV !== 'production';

const cacheAges = {
  usda: 24 * 1000 * 60 * 60, // 24h
  ssr: 1000 * 60 * 60, // 1h
  http: 24 * 60 * 60, // 24h
};

// ==================================
// USDA data cache (refresh interval: 24h)
// ==================================
let foodCache: FoodCache = [];
const updateFoodCache = async () => {
  foodCache = await fetchFoodsList();
  foodCache.age = new Date();
  console.log(foodCache.age.toISOString(), 'Updated cache.');

  // Update cache every 24h
  setTimeout(updateFoodCache, cacheAges.usda);
};
// ==================================

// ==================================
// SSR CACHE
// ==================================
// See https://github.com/zeit/next.js/blob/master/examples/ssr-caching/server.js
const ssrCache = new LRUCache({
  max: 100,
  maxAge: cacheAges.ssr, // 1 hour
});

async function renderAndCache(
  app: any,
  req: Express.Request,
  res: Express.Response,
  pagePath: string,
  queryParams?: any
) {
  const key = req.url;

  // If we have a page in the cache, let's serve it
  if (ssrCache.has(key)) {
    res.setHeader('x-cache', 'HIT');
    res.send(ssrCache.get(key));
    return;
  }

  try {
    // If not let's render the page into HTML
    const html = await app.renderToHTML(req, res, pagePath, queryParams);

    // Something is wrong with the request, let's skip the cache
    if (res.statusCode !== 200) {
      res.send(html);
      return;
    }

    // Let's cache this page
    ssrCache.set(key, html);

    res.setHeader('x-cache', 'MISS');
    res.send(html);
  } catch (err) {
    app.renderError(err, req, res, pagePath, queryParams);
  }
}
// ==================================

// ==================================
// HELPERS
// ==================================
const renderServerHealth = () =>
  `
<pre>
Platform: ${os.platform()}
CPUs: ${os.cpuCount()}
Free Mem: ${os.freemem()}
Total Mem: ${os.totalmem()}
Free Mem %: ${os.freememPercentage()}
Sys uptime: ${os.sysUptime()}
Proc uptime: ${os.processUptime()}

CPU Load 1 min: ${os.loadavg(1)}
CPU Load 5 min: ${os.loadavg(5)}
CPU Load 15 min: ${os.loadavg(15)}
</pre>
`;
// ==================================

// ==================================
// ROUTES
// ==================================
const setupRoutes = (nextApp: any, expressServer: Express.Express) => {
  const nextHandle = nextApp.getRequestHandler();

  expressServer.get('/', (req, res) => {
    res.set({
      // Push everything that is needed for FMP and avoids FOUT/FOUC.
      Link: [
        '</static/fonts/roboto-slab.woff2>; rel=preload; as=font; crossorigin=anonymous',
        '</static/fonts/roboto-condensed.woff2>; rel=preload; as=font; crossorigin=anonymous',
        '</static/css/global.css>; rel=preload; as=style',
        '</list>; rel=preload; as=fetch; crossorigin=anonymous',
      ],
      'X-Frame-Options': 'sameorigin',
    });

    return isDev
      ? nextHandle(req, res)
      : renderAndCache(nextApp, req, res, '/');
  });

  expressServer.get('/list', (_, res) => {
    return res.json(foodCache);
  });

  expressServer.get('/service-worker.js', (req, res) => {
    return nextApp.serveStatic(
      req,
      res,
      path.join(__dirname, '../.next/service-worker.js')
    );
  });

  expressServer.get('/health', (_, res) => {
    return res.send(renderServerHealth());
  });

  expressServer.get('/favicon.ico', (req, res) => {
    return nextApp.serveStatic(
      req,
      res,
      path.join(__dirname, '../static/favicon.ico')
    );
  });

  expressServer.get('/site.webmanifest', (req, res) => {
    return nextApp.serveStatic(
      req,
      res,
      path.join(__dirname, '../static/site.webmanifest')
    );
  });

  expressServer.get('*', (req, res) => {
    res.setHeader('Cache-Control', `public, max-age=${cacheAges.http}`);
    return nextHandle(req, res);
  });
};
// ==================================

export {setupRoutes, updateFoodCache};
