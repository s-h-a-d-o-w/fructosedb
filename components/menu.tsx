import React from 'react';
import styled from 'styled-components';

const MobileMenu = styled.div`
	background-color: ${(props) => props.theme.primary};
	color: black;

	position: absolute;
	left: 0;
	top: 0;
	z-index: 1001;
	width: 60vw;
	height: 100vh;
	padding: 2%;

	flex-direction: column;

	display: flex;
	@media all and (min-width: 45em) {
		display: none;
	}
`;

const HeaderMenu = styled.nav`
	grid-area: nav;

	display: none;
	@media all and (min-width: 45em) {
		display: inline-block;
		margin-top: 0.5rem;
		margin-bottom: 0.5rem;
		justify-self: end;
	}

	& > a {
		margin-right: 1rem;
	}
`;

const Burger = styled.div`
	position: absolute;
	left: 0;
	top: 0;
	width: 3rem;
	height: 3rem;

	font-size: 2rem;
	font-weight: bold;
	background-color: ${(props) => props.theme.primaryLight};
	color: ${(props) => props.theme.primaryDark};

	display: flex;
	justify-content: center;
	align-items: center;
	@media all and (min-width: 45em) {
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

class Menu extends React.Component<any> {
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

	render = () => (
		<React.Fragment>
			<Burger onClick={this.openMenu}>☰</Burger>
			{this.state.showMenu ? (
				<React.Fragment>
					<Lightbox onClick={this.closeMenu} />
					<MobileMenu>{this.props.children}</MobileMenu>
				</React.Fragment>
			) : (
				''
			)}
			<HeaderMenu>{this.props.children}</HeaderMenu>
		</React.Fragment>
	);
}

export default Menu;
