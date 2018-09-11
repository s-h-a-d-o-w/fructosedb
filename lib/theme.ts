export interface ITheme {
	largeThreshold: number;
	largeDevices: string;

	primaryLight: string;
	primary: string;
	primaryDark: string;
}

// http://paletton.com/#uid=34y0u0kn5sr5XTpg7ACsGlQGgbR
const theme: ITheme = {
	largeThreshold: 45, // em
	largeDevices: '@media all and (min-width: 45em)',

	primaryLight: '#D7C3EB',
	primary: '#653399', // almost rebeccapurple
	primaryDark: '#210340',

	// secondaryLight: '#FFF4D0',
	// secondary: '#E3BE3F',
	// secondaryDark: '#5E4900',
};

export default theme;
