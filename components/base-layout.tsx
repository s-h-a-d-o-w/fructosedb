import styled from 'styled-components';
import {Logo} from './logo';
import Navigation from './navigation';
import Link from './link';
import React from 'react';

const StyledBase = styled.div`
	display: grid;
	height: 100vh;

	grid-template-columns: 1fr auto 1fr;
	grid-template-rows: auto 1fr;
	grid-gap: 0.5rem 1rem;
	grid-template-areas:
		'. logo nav'
		'content content content';

	background-color: ${(props: any) => props.theme.primary};
	color: white;

	font-family: 'Roboto Slab', serif;

	input {
		min-width: 0.4rem;
		min-height: 0.4rem;
	}

	& > * {
		animation: fadeIn 250ms ease-in;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
`;

export default (props) => (
	<StyledBase>
		<Logo />
		<Navigation>
			<Link href="/sources">How We Calculate</Link>
			<Link href="/about">About Us</Link>
			<Link href="/support">❤️Support Us</Link>
		</Navigation>
		{props.children}
	</StyledBase>
);
