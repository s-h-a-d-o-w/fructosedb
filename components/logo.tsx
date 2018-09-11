import styled from 'styled-components';
import Link from './link';

const StyledLogo = styled.div`
	grid-area: logo;

	display: inline-block;
	font-size: 2.5rem;
	margin-top: 1.5rem;
`;

const Fructose = styled.span`
	color: ${(props) => props.theme.primaryLight};
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
