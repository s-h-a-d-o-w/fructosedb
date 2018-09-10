import React from 'react';
import styled from 'styled-components';

const StyledBase = styled.div`
	background-color: ${(props: any) => props.theme.primary};
	color: white;

	font-family: 'Roboto Slab', serif;
	font-size: 1rem;

	input {
		min-width: 0.4rem;
		min-height: 0.4rem;
	}
`;

export default ({children}) => <StyledBase>{children}</StyledBase>;
