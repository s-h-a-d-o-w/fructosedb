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
import CenteredContent from '../components/centered-content';
import FullScreenButton from '../components/fullscreen-button';

const PageLayout = styled.div`
	display: grid;
	grid-template-columns: 1fr auto 1fr;
	grid-template-rows: auto 1fr;
	height: 100vh;
	grid-gap: 1rem;

	grid-template-areas:
		'. logo nav'
		'content content content';
`;

const FullScreenContainer = styled.div`
	/* If background-color isn't set, :-webkit-full-screen (default: white) will be aplied */
	background-color: ${(props) => props.theme.primary};
	width: 100%;
	height: 100%;

	/* Make it possible for table to use 100% height without overflowing this container */
	display: flex;
	flex-direction: column;
`;

interface IProps {
	data: object[];
	dispatchKillFloat: () => void;
}

interface IState {
	hasMounted: boolean;
}

class Index extends React.Component<IProps, IState> {
	refContent = React.createRef<HTMLElement>();
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
					<CenteredContent gridArea="content">
						{/* Containers that use gridArea can't be made to use fullscreen as expected,
							a nested container is required. */}
						<FullScreenContainer innerRef={this.refContent}>
							{this.state.hasMounted ? <Options /> : ''}
							<Table {...this.props} />
							<FullScreenButton target={this.refContent} />
							<FloatingInfo />
						</FullScreenContainer>
					</CenteredContent>
				</PageLayout>
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
