import {SupportedLanguages} from 'types';

export const changeFilter = (value: string) =>
	({type: 'CHANGE_FILTER', value} as const);
export const changeLanguage = (value: SupportedLanguages) =>
	({type: 'CHANGE_LANGUAGE', value} as const);
export const changeSort = (sortBy: string, sortAsc: boolean) =>
	({
		type: 'CHANGE_SORT',
		sortBy,
		sortAsc,
	} as const);
export const changeTranslationTarget = (value: string) =>
	({
		type: 'CHANGE_TRANSLATION_TARGET',
		value,
	} as const);
export const hideFloat = () =>
	({
		type: 'HIDE_FLOAT',
	} as const);
export const rehydrate = () =>
	({
		type: 'REHYDRATE',
	} as const);
export const showFloat = (content: string, x: number, y: number) =>
	({
		type: 'SHOW_FLOAT',
		content,
		x,
		y,
	} as const);
export const toggleFruit = () =>
	({
		type: 'TOGGLE_FRUIT',
	} as const);
export const toggleLockAvoid = () =>
	({
		type: 'TOGGLE_LOCK_AVOID',
	} as const);
export const toggleServing = () =>
	({
		type: 'TOGGLE_SERVING',
	} as const);

export type Action =
	| {type: '@@INIT'}
	| ReturnType<typeof changeFilter>
	| ReturnType<typeof changeLanguage>
	| ReturnType<typeof changeSort>
	| ReturnType<typeof changeTranslationTarget>
	| ReturnType<typeof hideFloat>
	| ReturnType<typeof rehydrate>
	| ReturnType<typeof showFloat>
	| ReturnType<typeof toggleFruit>
	| ReturnType<typeof toggleLockAvoid>
	| ReturnType<typeof toggleServing>;
