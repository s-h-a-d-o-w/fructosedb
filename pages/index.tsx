import React from 'react';
import styled from 'styled-components';
import fetch from 'isomorphic-unfetch';

import {Logo} from '../components/logo';
import {Table} from '../containers/table';
import {Menu} from '../components/menu';

import 'react-virtualized/styles.css';
import {NextSFC} from 'next';

const PageLayout = styled.div`
	display: flex;
	background-color: rebeccapurple;
	color: white;

	height: 100vh;
	flex-direction: column;

	padding: 0vw 10vw;
	text-align: center;

	font-family: 'Lucida Sans Unicode', 'Lucida Grande', sans-serif;
`;

interface IProps {
	data: object[];
}

const Index: NextSFC<IProps> = (props) => (
	<PageLayout>
		<nav>
			<div style={{float: 'left'}}>☰</div>
			<Logo />
			<div style={{float: 'right'}}>Support us</div>
			<Menu>
				<div>Sources</div>
				<div>About Us</div>
			</Menu>
		</nav>
		<div style={{width: '100%'}}>
			<div style={{float: 'left'}}>
				<input type="checkbox" name="duplicates" />
				<label htmlFor="duplicates">Filter likely duplicates</label>
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
