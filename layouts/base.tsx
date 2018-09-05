import React from 'react';
import styled from 'styled-components';

const StyledBase = styled.div`
	background-color: ${(props: any) => props.theme.primary};
	color: ${(props: any) => props.theme.secondaryLight};

	font-family: 'Lucida Sans Unicode', 'Lucida Grande', sans-serif;
	font-size: 0.9rem;

	input {
		min-width: 0.4rem;
		min-height: 0.4rem;
	}
`;

export default ({children}) => <StyledBase>{children}</StyledBase>;
