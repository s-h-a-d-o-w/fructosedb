import * as React from 'react';
import styled from 'styled-components';

import theme from 'lib/theme';

import Link from './Link';

const StyledLogo = styled.div`
	grid-area: logo;
	align-self: end;

	font-size: 2rem;
	margin-top: 0.75rem;

	${theme.largeDevices} {
		font-size: 2.5rem;
	}
`;

const Fructose = styled.span`
	color: ${theme.primaryLight};
`;

const DB = styled.span`
	color: white;
`;

export const Logo = () => (
	<StyledLogo>
		<Link href="/">
			<Fructose>fructose</Fructose>
			<DB>db</DB>
		</Link>
	</StyledLogo>
);
