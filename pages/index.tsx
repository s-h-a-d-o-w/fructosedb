import React from 'react';
import styled from 'styled-components';
import fetch from '../lib/fetch-with-timeout.js';
import Link from 'next/link';

import {Logo} from '../components/logo';
import Table from '../containers/table';
import Menu from '../components/menu';

import 'react-virtualized/styles.css';
import {NextSFC} from 'next';

const PageLayout = styled.div`
	display: flex;
	background-color: rebeccapurple;
	color: white;

	height: 100vh;
	flex-direction: column;

	padding: 0 10vw;
	text-align: center;

	font-family: 'Lucida Sans Unicode', 'Lucida Grande', sans-serif;
	font-size: 0.9rem;

	input {
		min-width: 0.4rem;
		min-height: 0.4rem;
	}
`;

interface IProps {
	data: object[];
}

const Index: NextSFC<IProps> = (props) => (
	<PageLayout>
		<nav>
			<Logo />
			<div style={{float: 'right'}}>♡ Support us</div>
			<Menu>
				<Link prefetch href="/sources">
					<a>Sources</a>
				</Link>
				<Link prefetch href="/about">
					<a>About Us</a>
				</Link>
			</Menu>
		</nav>
		<div style={{width: '100%'}}>
			<div style={{float: 'left'}}>
				<input type="checkbox" name="measureToUse" />
				<label htmlFor="duplicates">Per serving</label>
			</div>
		</div>
		<Table {...props} />
	</PageLayout>
);

Index.getInitialProps = async () => {
	const res = await fetch(`${process.env.BACKEND_URL}/list`);
	return {data: await res.json()};
};

export default Index;
