import styled from 'styled-components';
import Link from './link';
import theme from '../lib/theme';

const StyledLogo = styled.div`
	grid-area: logo;
	align-self: end;

	font-size: 2rem;
	margin-top: 0.75rem;
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
