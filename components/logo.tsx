import styled from 'styled-components';

const StyledLogo = styled.div`
	grid-area: logo;

	display: inline-block;
	font-size: 2rem;
	margin-top: 1rem;
`;

const Fructose = styled.span`
	color: #d7c3eb;
`;

const DB = styled.span`
	color: #ffe27f;
`;

export const Logo = () => (
	<StyledLogo>
		<Fructose>fructose</Fructose>
		<DB>db</DB>
	</StyledLogo>
);
