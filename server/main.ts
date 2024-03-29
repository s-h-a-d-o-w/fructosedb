import '../env-config';

import * as next from 'next';
import * as express from 'express';
import * as compression from 'compression';

import {i18n} from './i18n';
import {setupRoutes, updateFoodCache} from './routes.js';

const port = process.env.PORT;
const isDev = process.env.NODE_ENV !== 'production';
// TODO: Wait for proper types for Next.js server
// @ts-ignore
const app = next({dev: isDev});

// TODO: Might want to cache SSR renderings at some point
// But first check what cache-less page load performance is like!
// https://github.com/zeit/next.js/blob/master/examples/ssr-caching/server.js

// At some point, this will become Node default behavior anyway.
process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at:', p, 'reason:', reason);
  process.exit(1);
});

app.prepare().then(() => {
  const server = express();
  server.use(compression());
  server.use(i18n);

  setupRoutes(app, server);
  updateFoodCache().then(() => {
    server.listen(port, () => {
      console.log(`> ${isDev ? 'Dev' : 'Prod'} ready @ PORT ${port}`);

      if ('TESTRUN' in process.env || 'TRAVIS' in process.env) {
        process.exit(0);
      }
    });
  });
});
