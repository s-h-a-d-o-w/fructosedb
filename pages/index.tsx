import styled from 'styled-components';
import fetch from '../lib/fetch-with-timeout.js';
import {connect} from 'react-redux';

import BaseLayout from '../layouts/base';
import {Logo} from '../components/logo';
import Options from '../containers/options';
import Link from '../components/link';
import Menu from '../components/menu';
import Table from '../containers/virtual-table';
import FloatingInfo from '../containers/floating-info';

import 'react-virtualized/styles.css';
import {NextSFC} from 'next';
import {actions} from '../store/store';

const PageLayout = styled.div`
	display: grid;
	grid-template-columns: 1fr auto 1fr;
	grid-template-rows: auto auto 1fr;
	height: 100vh;

	grid-template-areas:
		'. logo nav'
		'options options options'
		'table table table';
`;

interface IProps {
	data: object[];
}

const Index: NextSFC<IProps> = (props: any) => (
	<BaseLayout>
		<PageLayout onClick={props.dispatchKillFloat}>
			<Logo />
			<Menu>
				<Link href="/sources">How We Calculate</Link>
				<Link href="/about">About Us</Link>
				<Link href="/support">❤️Support Us</Link>
			</Menu>
			<Options />
			<Table {...props} />
		</PageLayout>
		<FloatingInfo />
	</BaseLayout>
);

Index.getInitialProps = async () => {
	const res = await fetch(`${process.env.BACKEND_URL}/list`);
	return {data: await res.json()};
};

const mapDispatchToProps = (dispatch) => ({
	dispatchKillFloat: () => dispatch(actions.killFloat()),
});

export default connect(
	null,
	mapDispatchToProps
)(Index);
