import * as React from 'react';
import styled from 'styled-components';
import {connect} from 'react-redux';
import {Dispatch} from 'redux';
import screenfull from 'screenfull';

import BaseLayout from 'components/BaseLayout';
import CenteredContent from 'components/CenteredContent';
import Loading from 'components/Loading';
import FloatingInfo from 'containers/FloatingInfo';
import FullScreenButton from 'containers/FullscreenButton';
import Options from 'containers/Options';
import Table from 'containers/VirtualTable';
import theme from 'lib/theme';
import {isEmptyObject} from 'lib/util';
import {hideFloat} from 'store/actions';
import {ReduxState} from 'store';

const FullScreenContainer = styled.div`
	/* If background-color isn't set, :-webkit-full-screen (default: white) will be aplied */
	background-color: ${theme.primary};
	width: 100%;
	height: 100%;

	/* Make it possible for table to use 100% height without overflowing this container */
	display: flex;
	flex-direction: column;
`;

type Props = ReturnType<typeof mapStateToProps> &
	ReturnType<typeof mapDispatchToProps>;

type State = {
	hasMounted: boolean;
};

class Index extends React.Component<Props, State> {
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

	hideFloat = () => {
		if (this.props.float && !isEmptyObject(this.props.float))
			this.props.dispatchHideFloat();
	};

	render() {
		return (
			<>
				<BaseLayout onClick={this.hideFloat} onTouchStart={this.hideFloat}>
					<CenteredContent>
						{/* Containers that use gridArea can't be made to use fullscreen as expected,
							a nested container is required. */}
						{this.state.hasMounted ? (
							<FullScreenContainer ref={this.refContent}>
								<Options />
								<Table />
								{screenfull && screenfull.enabled ? (
									<FullScreenButton target={this.refContent} />
								) : (
									''
								)}
								<FloatingInfo />
							</FullScreenContainer>
						) : (
							<Loading />
						)}
					</CenteredContent>
				</BaseLayout>
			</>
		);
	}
}

const mapStateToProps = ({float}: ReduxState) => ({
	float,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
	dispatchHideFloat: () => dispatch(hideFloat()),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Index);
