import React from 'react';
import styled from 'styled-components';

const MobileMenu = styled.div`
	background-color: white;

	position: absolute;
	left: 0;
	width: 200px;

	flex-direction: column;

	display: flex;
	@media all and (min-width: 45em) {
		display: none;
	}
`;

const HeaderMenu = styled.div`
	color: lightgreen;
	float: right;

	display: none;
	@media all and (min-width: 45em) {
		display: flex;
	}
`;

export const Menu = (props) => (
	<React.Fragment>
		<MobileMenu>{props.children}</MobileMenu>
		<HeaderMenu>{props.children}</HeaderMenu>
	</React.Fragment>
);
