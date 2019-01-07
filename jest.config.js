const TEST_REGEX = '(/__tests__/.*|(\\.|/)(test|spec))\\.(tsx?|ts?)$';

module.exports = {
	setupFiles: ['<rootDir>/jest.setup.js'],
	testRegex: TEST_REGEX,
	transform: {
		'^.+\\.(tsx?)$': 'babel-jest',
	},
	testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
	moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
	collectCoverage: true,
	collectCoverageFrom: [
		'components/**/*.{ts,tsx}',
		'containers/**/*.{ts,tsx}',
		'lib/**/*.{ts,tsx}',
		'pages/**/*.{ts,tsx}',
		'server/**/*.{ts,tsx}',
		'store/**/*.{ts,tsx}',
	],
};