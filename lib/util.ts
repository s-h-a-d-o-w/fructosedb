// See: https://stackoverflow.com/a/32108184/5040168
export const isEmptyObject = (obj: object): boolean =>
	Object.keys(obj).length === 0 && obj.constructor === Object;
