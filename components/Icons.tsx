import * as React from 'react';
import styled from 'styled-components';

const StyledSVG = React.memo(styled.svg`
  width: 1.3em;
  height: 1.3em;

  .symbol {
    stroke-width: 8px;
    stroke: #fff;
  }
`);

export const avoid = (
  <StyledSVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
    <title>Avoid (or consume only a small amount at a time)</title>
    <circle cx="26" cy="26" r="25" fill="red" />
    <path className="symbol" fill="none" d="M15 15 37 37" />
    <path className="symbol" fill="none" d="M15 37 37 15" />
  </StyledSVG>
);

export const ok = (
  <StyledSVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
    <title>OK</title>
    <circle cx="26" cy="26" r="25" fill="green" />
    <path className="symbol" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
  </StyledSVG>
);
