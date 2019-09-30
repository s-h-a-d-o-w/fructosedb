import * as React from 'react';
import NextHead from 'next/head';

import {useTypedSelector} from 'store';

export const Head = React.memo(() => {
  const lang = useTypedSelector((state) => state.lang);

  return (
    <NextHead>
      {lang === 'en' ? (
        <>
          <title>fructosedb - find low fructose foods</title>
          <meta
            name="Description"
            content='A list of foods with their fructose and glucose content that allows people
					suffering from fructose malabsorption (also sometimes referred to as "fructose intolerance" or
					"DFI") to adjust their diet more easily.'
          />
        </>
      ) : (
        <>
          <title>
            fructosedb - finde Lebensmittel mit niedrigem Fruktosegehalt
          </title>
          <meta
            name="Description"
            content="Eine Liste an Lebensmitteln mit deren Fruktose und Glukosegehalt, die es Leuten mit
					Fruktoseintoleranz (die schwerwiegendere Form von Fruktosemalabsorption) ermöglicht
					herauszufinden welche Lebensmittel für sie geeignet sind."
          />
        </>
      )}
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="theme-color" content="#653399" />
      <link rel="manifest" href="/site.webmanifest" />
      <link rel="stylesheet" href="/static/css/global.css" />
      {/* Force favicon refresh on changes */}
      <link rel="icon" type="image/x-icon" href="/favicon.ico?v=20181018" />
      <link rel="prefetch" href="/static/images/usda-symbol.svg" />
    </NextHead>
  );
});
