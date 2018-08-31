import React from 'react';
import styled from 'styled-components';

const StyledLogo = styled.div`
	position: absolute;
	left: 50%;
	transform: translateX(-50%);
`;

export const Logo = () => <StyledLogo>fructose.db</StyledLogo>;
