import styled from 'styled-components';
import theme from '../lib/theme';

export default styled.div`
	position: fixed;
	left: 0;
	top: 0;
	width: 3rem;
	height: 3rem;

	font-size: 2rem;
	font-weight: bold;
	background-color: ${theme.primaryLight};
	color: ${theme.primaryDark};

	display: flex;
	justify-content: center;
	align-items: center;
	${theme.largeDevices} {
		display: none;
	}
`;
