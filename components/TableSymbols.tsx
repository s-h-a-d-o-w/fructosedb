import styled from 'styled-components';
import * as React from 'react';

const StyledSVG = styled.svg`
	width: 1.3em;
	height: 1.3em;

	.symbol {
		stroke-width: 0.7em;
		stroke: #fff;
	}
`;

const Error = (
	<StyledSVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
		<circle cx="26" cy="26" r="25" fill="red" />
		<path className="symbol" fill="none" d="M15 15 37 37" />
		<path className="symbol" fill="none" d="M15 37 37 15" />
	</StyledSVG>
);

const OK = (
	<StyledSVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
		<circle cx="26" cy="26" r="25" fill="green" />
		<path className="symbol" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
	</StyledSVG>
);

export {Error, OK};
