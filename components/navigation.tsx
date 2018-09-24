import React from 'react';
import styled from 'styled-components';

import theme from '../lib/theme';
import Link from './link';
import Burger from './Burger';
import Menu from './menu';

const StyledBurger = styled(Burger)`
	position: fixed;
	left: 0;
	top: 0;
`;

const StyledNav = styled.nav`
	grid-area: nav;

	display: grid;
	justify-items: end;
	grid-template-rows: auto auto 1fr;

	& * {
		margin-top: 0.5rem;
		margin-right: 0.5rem;
	}
`;

const StyledSupport = styled.nav`
	text-align: right;

	${theme.largeDevices} {
		font-size: 1.5rem;
	}
`;

const StyledLightbox = styled.div`
	position: absolute;
	left: 0;
	top: 0;
	width: 100%;
	height: 100%;
	z-index: 1000;

	background-color: black;
	opacity: 0.5;
`;

export default class extends React.Component {
	state = {
		showMenu: false,
	};

	constructor(props) {
		super(props);
	}

	closeMenu = () => {
		this.setState({showMenu: false});
	};

	openMenu = () => {
		this.setState({showMenu: true});
	};

	menu = () => (
		<>
			<Link href="/sources">How We Calculate</Link>
			<Link href="/about">About Us</Link>
		</>
	);

	render = () => (
		<>
			<StyledBurger onClick={this.openMenu}>☰</StyledBurger>
			{this.state.showMenu ? (
				<>
					<StyledLightbox onClick={this.closeMenu} />
					<Menu desktop={false}>{this.menu()}</Menu>
				</>
			) : (
				''
			)}
			<StyledNav>
				<Menu desktop={true}>{this.menu()}</Menu>
				<StyledSupport>
					<Link href="http://www.google.com">❤️Support Us</Link>
				</StyledSupport>
			</StyledNav>
		</>
	);
}
