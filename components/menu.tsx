import React from 'react';
import styled from 'styled-components';

const MobileMenu = styled.div`
	background-color: white;
	color: black;

	position: absolute;
	left: 0;
	width: 200px;
	height: 100%;

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

const Burger = styled.div`
	position: absolute;
	left: 0;
	top: 0;

	font-size: 2rem;

	display: inline-block;
	@media all and (min-width: 45em) {
		display: none;
	}
`;

const Lightbox = styled.div`
	position: absolute;
	left: 0;
	top: 0;

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
