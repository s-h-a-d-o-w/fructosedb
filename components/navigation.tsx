import React from 'react';
import styled from 'styled-components';
import Link from './link';
import theme from '../lib/theme';

const MobileMenu = styled.div`
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

const DesktopMenu = styled.div`
	display: none;
	${theme.largeDevices} {
		display: inline-block;
	}
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

const Burger = styled.div`
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

const Lightbox = styled.div`
	position: absolute;
	left: 0;
	top: 0;
	z-index: 1000;

	background-color: black;
	opacity: 0.5;

	width: 100%;
	height: 100%;
`;

class Navigation extends React.Component {
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
			<Burger onClick={this.openMenu}>☰</Burger>
			{this.state.showMenu ? (
				<>
					<Lightbox onClick={this.closeMenu} />
					<MobileMenu>{this.menu()}</MobileMenu>
				</>
			) : (
				''
			)}
			<StyledNav>
				<DesktopMenu>{this.menu()}</DesktopMenu>
				<StyledSupport>
					<Link href="http://www.google.com">❤️Support Us</Link>
				</StyledSupport>
			</StyledNav>
		</>
	);
}

export default Navigation;
