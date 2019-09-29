declare namespace Express {
	export interface Request {
		locale: string;
		localeDataScript: (locale: string) => any;
		messages: object;
	}
}
