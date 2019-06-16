export type Food = {
	ndbno: string;
	name: string;
	weight: number;
	measure: string;
	fructose: number;
	sucrose: number;
	glucose: number;
	fructoseServing: number;
	sucroseServing: number;
	glucoseServing: number;
	ratio: number;
	avoid: boolean;
	isFruit: boolean;
};

export interface FoodCache extends Array<Food> {
	age?: Date;
}

export type SupportedLanguages = 'en' | 'de';
