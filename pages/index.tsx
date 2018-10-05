import * as React from 'react';
import styled from 'styled-components';
import {connect} from 'react-redux';

import BaseLayout from '../components/BaseLayout';
import Options from '../containers/Options';
import Table from '../containers/VirtualTable';
import FloatingInfo from '../containers/FloatingInfo';

import 'react-virtualized/styles.css';
import {actions} from '../store/store';
import CenteredContent from '../components/CenteredContent';
import FullScreenButton from '../components/FullscreenButton';
import Loading from '../components/Loading';
import theme from '../lib/theme';
import {isEmptyObject} from '../lib/util';
import {Dispatch} from 'redux';

const FullScreenContainer = styled.div`
	/* If background-color isn't set, :-webkit-full-screen (default: white) will be aplied */
	background-color: ${theme.primary};
	width: 100%;
	height: 100%;

	/* Make it possible for table to use 100% height without overflowing this container */
	display: flex;
	flex-direction: column;
`;

interface IProps {
	data: object[];
	dispatch: Dispatch;
	float: object;
	dispatchKillFloat: () => void;
}

interface IState {
	hasMounted: boolean;
}

class Index extends React.Component<IProps, IState> {
	refContent = React.createRef<HTMLDivElement>();
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

	render() {
		//console.log('index.render()');
		return (
			<BaseLayout
				onClick={this.props.dispatchKillFloat.bind(null, this.props.float)}
			>
				<CenteredContent>
					{/* Containers that use gridArea can't be made to use fullscreen as expected,
							a nested container is required. */}
					{this.state.hasMounted ? (
						<FullScreenContainer innerRef={this.refContent}>
							<Options />
							<Table dispatchKillFloat={this.props.dispatchKillFloat} />
							<FullScreenButton target={this.refContent} />
							<FloatingInfo />
						</FullScreenContainer>
					) : (
						<Loading />
					)}
				</CenteredContent>
			</BaseLayout>
		);
	}
}

const mapStateToProps = ({float}) => ({
	float,
});

const dispatchKillFloat = (dispatch, float) => {
	if (float && !isEmptyObject(float)) dispatch(actions.killFloat());
};

const mapDispatchToProps = (dispatch) => ({
	dispatchKillFloat: dispatchKillFloat.bind(null, dispatch),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Index);
