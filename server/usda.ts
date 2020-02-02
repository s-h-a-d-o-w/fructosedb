import * as querystring from 'querystring';

import {fetchJSON} from '../lib/fetch-with-timeout';
import {Food} from 'types';

const isDev = process.env.NODE_ENV !== 'production';
const isTest = process.env.NODE_ENV === 'test';

type Nutrient = {
  nutrient_id: string;
  nutrient: string;
  unit: string;
  value: string;
  gm: number | '--';
};

type ValidNutrient = Nutrient & {
  gm: number;
};

type USDAFood = {
  ndbno: string;
  name: string;
  weight: number;
  measure: string;
  nutrients: Nutrient[];
};

type ValidUSDAFood = USDAFood & {
  nutrients: ValidNutrient[];
};

type USDAReport = {
  sr: string;
  groups: string;
  subset: string;
  end: number;
  start: number;
  total: number;
  foods: USDAFood[];
};

// DATA CALCULATION
// ------------------------------------
export const nutrientPerServing = (gm: number, weight: number): number =>
  Math.round(gm * weight) / 100;

export const fructoseGlucoseRatio = (
  fructose: number,
  sucrose: number,
  glucose: number
): number =>
  Math.round(((fructose + 0.5 * sucrose) / (glucose + 0.5 * sucrose)) * 100) /
  100;

// See: https://www.foodsmatter.com/miscellaneous_articles/sugar_sweeteners/articles/fructose-intol-joneja-09-14.html
export const shouldAvoid = (
  servingSize: number,
  fructose: number,
  sucrose: number,
  glucose: number
): boolean => {
  // Fructose should not exceed glucose by more than 0.5/100g
  let relative = fructose + 0.5 * sucrose - (glucose + 0.5 * sucrose) > 0.5;

  // No more than 3g per serving (we of course have to estimate based on what
  // the USDA says the serving size is)
  let absolute =
    (servingSize / 100) * fructose + (servingSize / 100) * sucrose * 0.5 > 3;

  return relative || absolute;
};
// ------------------------------------

// DATA TRANSFORMATION
// ------------------------------------
/**
 * Removes unnecessary items by first grouping items with similar F/G ratios, then
 * comparing their names.
 * For instance - if a given food has the same F/G ratio when raw vs. when cooked, there
 * is no need to list it twice.
 */
export const removeSimilar = (data: Food[]): Food[] => {
  const thresholdRatio = 0.1;
  const thresholdFructose = 1;
  // Threshold of 5 e.g. removes apple juices -> too short
  const thresholdName = 7; // number of characters that have to match
  const similar: number[][] = [];

  // Find similar F/G ratios
  data = data.sort((a, b) => a.ratio - b.ratio);
  for (let i = 0; i < data.length - 1; i++) {
    // Could also create on demand in loop below - memory use vs. runtime perf
    similar[i] = [];

    // Check items that follow until F/G ratio diff becomes too big
    for (
      let j = i + 1;
      j < data.length && data[j].ratio - data[i].ratio < thresholdRatio;
      j++
    ) {
      // Amount of fructose being too different is also an important factor
      if (Math.abs(data[i].fructose - data[j].fructose) < thresholdFructose) {
        similar[i].push(j);
      }
    }
  }

  // Find similar names among similar ratios
  let elementsToRemove: null[] = [];
  similar.forEach((el, idx) => {
    if (el.length > 0) {
      const nameBeginning = data[idx].name.substr(0, thresholdName);
      el.forEach((innerIdx) => {
        if (nameBeginning === data[innerIdx].name.substr(0, thresholdName))
          elementsToRemove[innerIdx] = null;
      });
    }
  });

  // Actually remove the likely duplicates
  let countTotal = data.length;
  let countRemoved = 0;
  for (let i = elementsToRemove.length - 1; i >= 0; i--) {
    if (elementsToRemove[i] === null) {
      data.splice(i, 1);
      countRemoved++;
    }
  }
  console.log(
    `Removed ${countRemoved}/${countTotal} items because of similarity.`
  );

  return data;
};

function removeInvalidData(data: USDAFood[]) {
  return data.filter(
    (el) =>
      el.nutrients[2].gm !== '--' &&
      el.nutrients[0].gm !== '--' &&
      el.nutrients[1].gm !== '--'
  ) as ValidUSDAFood[];
}

// Format the data the way the frontend needs it.
// Discard items that don't contain all needed nutrient info.
export const transformData = (
  data: USDAFood[],
  fruitIDs: string[] = []
): Food[] =>
  removeInvalidData(data).map(
    ({ndbno, name, weight, measure, nutrients}: ValidUSDAFood) => ({
      ndbno,
      name,
      weight,
      measure,
      fructose: nutrients[2].gm,
      sucrose: nutrients[0].gm,
      glucose: nutrients[1].gm,
      fructoseServing: nutrientPerServing(nutrients[2].gm, weight),
      sucroseServing: nutrientPerServing(nutrients[0].gm, weight),
      glucoseServing: nutrientPerServing(nutrients[1].gm, weight),
      ratio: fructoseGlucoseRatio(
        nutrients[2].gm,
        nutrients[0].gm,
        nutrients[1].gm
      ),
      avoid: shouldAvoid(
        weight,
        nutrients[2].gm,
        nutrients[0].gm,
        nutrients[1].gm
      ),
      isFruit: fruitIDs.includes(ndbno),
    })
  );
// ------------------------------------

// Used in dev env or if calls to USDA DB fail.
function getCommittedData(filename: string) {
  const fs = require('fs');
  const path = require('path');

  return JSON.parse(
    fs.readFileSync(path.join(__dirname, `data/${filename}`), 'utf8')
  );
}

export async function getFruitIDs(): Promise<string[]> {
  // For food group ID see: https://api.nal.usda.gov/ndb/list?format=json&lt=g&sort=n&api_key=DEMO_KEY
  // It'll effectively be: https://api.nal.usda.gov/ndb/nutrients/?api_key=MY_KEY&max=1500&offset=0&fg=0900&nutrients=210
  let foods: USDAFood[];
  try {
    foods = (isDev && !isTest) ? (await getReport(1500, 0, '0900')).foods : getCommittedData('usdaFruit.json').foods;
  } catch (error) {
    console.error(error);
    console.log('Using committed USDA fruit data.');
    foods = getCommittedData('usdaFruit.json').foods;
  }

  const ids: string[] = [];
  foods.forEach((el) => ids.push(el.ndbno));
  return ids;
}

export async function getReport(
  max: number = 1,
  offset: number = 0,
  fg: string | string[] = ''
): Promise<USDAReport> {
  const query = querystring.stringify({
    api_key: process.env.USDA_KEY,
    nutrients: [210, 211, 212],
    max, // number of elements to return. default: 50
    offset,
    fg, // food group (used for figuring out which are fruits)
  });
  const dbURL = `http://api.nal.usda.gov/ndb/nutrients/?${query}`;

  let response;
  try {
    response = await fetchJSON(dbURL);
  } catch (error) {
    throw error;
  }

  return response.report;
}

// Get full list of foods from the USDA DB.
// Data rearranged as needed by the frontend. (see transformData())
export async function fetchFoodsList(): Promise<Food[]> {
  let data: USDAFood[] = [];

  if (isDev && !isTest) {
    console.log('DEV ENV: Using committed USDA data.');
    data = getCommittedData('usdaData.json');
  } else {
    try {
      // Included food groups.
      // Only 10 can be specified at once!
      // See also: https://api.nal.usda.gov/ndb/list?format=json&lt=g&sort=n&api_key=DEMO_KEY
      // prettier-ignore
      let foodGroups = [
				['3500', '1800', '1300', '1400', '0800', '2000', '0100', '1500', '0900', '1700'],
				['1600', '2200', '1200', '1000', '0500', '0700', '2500', '0200', '1900', '1100']
			];

      for (let fg of foodGroups) {
        // Dummy report fetch gives us total number of foods
        let total: number = (await getReport(1, 0, fg)).total;

        for (let offset = 0; offset < total; offset += 1500) {
          let report: USDAReport = await getReport(1500, offset, fg);
          data = data.concat(report.foods);
        }
      }
    } catch (error) {
      console.error(error);
      console.log('Using committed USDA data.');
      data = getCommittedData('usdaData.json');
    }
  }

  return removeSimilar(transformData(data, await getFruitIDs()));
}
