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
	height: 100vh;
	flex-direction: column;

	padding: 0 10vw;
	text-align: center;
`;

interface IProps {
	data: object[];
}

const Index: NextSFC<IProps> = (props) => (
	<PageLayout>
		<Logo />
		<nav style={{marginTop: '0.5rem', marginBottom: '0.5rem'}}>
			<Menu>
				<Link prefetch href="/sources">
					<a>Sources</a>
				</Link>
				<Link prefetch href="/about">
					<a>About Us</a>
				</Link>
				<Link prefetch href="/support">
					<a>♡ Support us</a>
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
