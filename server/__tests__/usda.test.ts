import * as jestFetchMock from 'jest-fetch-mock';
import {
	fetchFoodsList,
	fructoseGlucoseRatio,
	getReport,
	removeSimilar,
	shouldAvoid,
	transformData,
} from '../usda';

jest.mock('isomorphic-unfetch', () => require('jest-fetch-mock'));
const fetch = require('isomorphic-unfetch') as typeof jestFetchMock;

const usdaData = {
	report: {
		sr: '1',
		groups: [
			{
				id: '0900',
				description: 'Fruits and Fruit Juices',
			},
		],
		subset: 'All foods',
		end: 1,
		start: 0,
		total: 1,
		foods: [
			{
				ndbno: '09513',
				name: 'Fruit juice smoothie, ODWALLA, ORIGINAL SUPERFOOD',
				weight: 227,
				measure: '1.0 cup',
				nutrients: [
					{
						nutrient_id: '210',
						nutrient: 'Sucrose',
						unit: 'g',
						value: '8.19',
						gm: 3.61,
					},
					{
						nutrient_id: '211',
						nutrient: 'Glucose (dextrose)',
						unit: 'g',
						value: '5.11',
						gm: 2.25,
					},
					{
						nutrient_id: '212',
						nutrient: 'Fructose',
						unit: 'g',
						value: '9.74',
						gm: 4.29,
					},
				],
			},
		],
	},
};

beforeAll(() => {
	fetch.mockResponse(JSON.stringify(usdaData));
});

describe('fetchFoodsList', function() {
	it('fetches foods correctly', function(done) {
		fetchFoodsList().then((foods) => {
			expect(foods.length).toEqual(1);
			done();
		});
	});
});

describe('fructoseGlucoseRatio', function() {
	it('is correct', function() {
		expect(fructoseGlucoseRatio(3, 6, 3)).toEqual(1);
		expect(fructoseGlucoseRatio(4, 4, 1)).toEqual(2);
		expect(fructoseGlucoseRatio(4, 4, 2)).toEqual(1.5);
		expect(fructoseGlucoseRatio(2, 0, 4)).toEqual(0.5);
	});
});

describe('getReport', function() {
	it('extracts report correctly from USDA data', function(done) {
		getReport().then((report) => {
			expect(report.foods.length).toEqual(1);
			done();
		});
	});

	it('throws if request is rejected', async function() {
		fetch.mockRejectOnce(new Error('Request rejected'));

		// See: https://github.com/facebook/jest/issues/3601#issuecomment-411244192
		await expect(getReport()).rejects.toThrow();
	});
});

describe('removeSimilar', function() {
	it('should remove similar foods', function() {
		let baseFood = transformData(usdaData.report.foods);

		// Duplicate and modify slightly
		baseFood = baseFood.concat(baseFood);
		baseFood[0].ratio -= 0.01;

		expect(baseFood.length).toEqual(2);
		expect(removeSimilar(baseFood).length).toEqual(1);
	});
});

describe('shouldAvoid', function() {
	it('fructose exceeds glucose by more than 0.5/100g', function() {
		expect(shouldAvoid(1, 2, 0, 0)).toEqual(true);
		expect(shouldAvoid(1, 1, 1, 0)).toEqual(true);
		expect(shouldAvoid(1, 0, 2, 0)).toEqual(false);
		expect(shouldAvoid(1, 1, 0, 2)).toEqual(false);
	});

	it('more than 3g of fructose per serving', function() {
		expect(shouldAvoid(100, 3.1, 0, 10)).toEqual(true);
		expect(shouldAvoid(100, 3, 0, 10)).toEqual(false);
		expect(shouldAvoid(100, 1.6, 3, 10)).toEqual(true);
		expect(shouldAvoid(100, 1.5, 3, 10)).toEqual(false);
	});
});

describe('transformData', function() {
	it('should transform valid non-fruit correctly', function() {
		const transformedFood = transformData(usdaData.report.foods);
		expect(typeof transformedFood[0].fructoseServing).toEqual('number');
		expect(transformedFood[0].isFruit).toEqual(false);
	});

	it('should filter out invalid food', function() {
		// Mock invalid food
		const invalidFood = usdaData.report.foods.slice();
		(invalidFood[0].nutrients[0].gm as any) = '--';

		var transformedFood = transformData(invalidFood);
		expect(transformedFood.length).toEqual(0);
	});
});
