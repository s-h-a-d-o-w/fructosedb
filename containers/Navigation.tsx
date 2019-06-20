import * as React from 'react';
import styled from 'styled-components';

import Burger from 'components/Burger';
// import Link from '../components/Link';
import Menu from 'components/Menu';
import theme from 'lib/theme';

const StyledBurger = styled(Burger)`
	position: fixed;
	left: 0;
	top: 0;

	cursor: pointer; // In case of small window on desktop

	${theme.largeDevices} {
		display: none;
	}
`;

/*
const StyledSupport = styled.nav`
	text-align: right;

	${theme.largeDevices} {
		font-size: 1.5rem;
	}
`;
*/

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

	closeMenu = () => {
		this.setState({showMenu: false});
	};

	openMenu = () => {
		this.setState({showMenu: true});
	};

	render = () => (
		<>
			<StyledBurger onClick={this.openMenu} />
			{this.state.showMenu && (
				<>
					<StyledLightbox onClick={this.closeMenu} />
					<Menu onClick={this.closeMenu} desktop={false} />
				</>
			)}
			<Menu desktop={true} />
			{/*
				<StyledSupport>
					<Link target="_blank" href="/support">
						❤️Support Us
					</Link>
				</StyledSupport>
				*/}
		</>
	);
}
