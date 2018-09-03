import React from 'react';
import styled from 'styled-components';

const StyledLogo = styled.div`
	display: inline-block;

	font-size: 2rem;
`;

const Fructose = styled.span`
	color: #d7c3eb;
`;

const DB = styled.span`
	color: #210340;
`;

export const Logo = () => (
	<StyledLogo>
		<Fructose>fructose</Fructose>
		<DB>db</DB>
	</StyledLogo>
);
