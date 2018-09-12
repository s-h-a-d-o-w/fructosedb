import styled from 'styled-components';
import theme from '../lib/theme';

const Mobile = styled.div`
	background-color: ${theme.primary};

	position: absolute;
	left: 0;
	top: 0;
	z-index: 1001;
	width: 60vw;
	height: 100vh;
	padding: 2%;

	text-align: right;

	flex-direction: column;

	display: flex;
	${theme.largeDevices} {
		display: none;
	}

	a {
		margin-top: 1rem;
		margin-right: 1rem;
	}
`;

const Desktop = styled.div`
	display: none;
	${theme.largeDevices} {
		display: inline-block;
	}
`;

export default (props) =>
	props.desktop ? <Desktop {...props} /> : <Mobile {...props} />;
