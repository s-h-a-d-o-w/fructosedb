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
import {actions} from '../store/store';
import React from 'react';

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

// interface IProps {
// 	data: object[];
// }

class Index extends React.Component<any, any> {
	state = {
		hasMounted: false,
	};

	componentDidMount() {
		// Options are meaningless if the user can't do anything with them.
		// But they'd still show long before the table due to SSR.
		this.setState({
			hasMounted: true,
		});
	}

	static async getInitialProps() {
		const res = await fetch(`${process.env.BACKEND_URL}/list`);
		return {data: await res.json()};
	}

	render() {
		return (
			<BaseLayout>
				<PageLayout onClick={this.props.dispatchKillFloat}>
					<Logo />
					<Menu>
						<Link href="/sources">How We Calculate</Link>
						<Link href="/about">About Us</Link>
						<Link href="/support">❤️Support Us</Link>
					</Menu>
					{this.state.hasMounted ? <Options /> : ''}
					<Table {...this.props} />
				</PageLayout>
				<FloatingInfo />
			</BaseLayout>
		);
	}
}

const mapDispatchToProps = (dispatch) => ({
	dispatchKillFloat: () => dispatch(actions.killFloat()),
});

export default connect(
	null,
	mapDispatchToProps
)(Index);
