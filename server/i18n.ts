// See: https://github.com/zeit/next.js/tree/canary/examples/with-react-intl

// Polyfill Node with `Intl` that has data for all locales.
// See: https://formatjs.io/guides/runtime-environments/#server
const IntlPolyfill = require('intl');
Intl.NumberFormat = IntlPolyfill.NumberFormat;
Intl.DateTimeFormat = IntlPolyfill.DateTimeFormat;

const {basename, join} = require('path');
const accepts = require('accepts');
const glob = require('glob');

import {Request, Response} from 'express';

// Get the supported languages by looking for translations in the `lang/` dir.
const supportedLanguages = (glob.sync(
  join(__dirname, '../lang/*.ts')
) as string[]).map((f) => basename(f, '.ts'));

// We need to load and expose the translations on the request for the user's
// locale. These will only be used in production, in dev the `defaultMessage` in
// each message description in the source code will be used.
const getMessages = (locale: string) => {
  return require(join(__dirname, `../lang/${locale}`)).default;
};

export const i18n = (req: Request, _: Response, next: Function) => {
  const accept = accepts(req);
  const locale: string = accept.language(supportedLanguages) || 'en';
  req.locale = locale;
  req.messages = getMessages(locale);
  next();
};
