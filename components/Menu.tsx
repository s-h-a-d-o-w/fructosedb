import * as React from 'react';
import styled from 'styled-components';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import theme from '../lib/theme';
import Link from './Link';

const Mobile: any = styled.div`
	transition: left 150ms ease-in-out;
	left: 0;

	background-color: ${theme.primary};

	position: absolute;
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

	// ReactCSSTransitionGroup classes
	&.menu-appear {
		// initial value
		left: -60vw;
	}

	&.menu-appear.menu-appear-active {
		// animation target (see also transition property above)
		// set briefly after inital value
		left: 0;
	}
`;

const Desktop = styled.div`
	display: none;
	${theme.largeDevices} {
		display: inline-block;
	}
`;

export default (props) => {
	let items = (
		<>
			<Link href="/">Home</Link>
			<Link href="/sources">How We Calculate</Link>
			<Link href="/about">About Us</Link>
		</>
	);

	return props.desktop ? (
		<Desktop>{items}</Desktop>
	) : (
		<ReactCSSTransitionGroup
			transitionName="menu"
			transitionAppear={true}
			transitionAppearTimeout={20} // Value has no consequence on animation
			transitionEnter={false}
			transitionLeave={false}
		>
			<Mobile>{items}</Mobile>
		</ReactCSSTransitionGroup>
	);
};
