import React from 'react';
import styled from 'styled-components';
import fetch from 'isomorphic-unfetch';

import {Logo} from '../components/logo';
import {Table} from '../containers/table';

import 'react-virtualized/styles.css'; // only needs to be imported once

const PageLayout = styled.div`
	display: flex;
	background-color: bisque;

	/* height: 100vh; */
	flex-direction: column;

	padding: 0vw 10vw;
	text-align: center;
`;

const Index: any = (props) => (
	<PageLayout>
		<Logo />
		<p>This is gonna be great.</p>
		<div>
			<input type="checkbox" name="duplicates" />
			<label htmlFor="duplicates">Filter likely duplicates</label>
		</div>
		<Table {...props} />
	</PageLayout>
);

Index.getInitialProps = async () => {
	const res = await fetch(`${process.env.BACKEND_URL}/list`);
	return {data: await res.json()};
};

export default Index;
