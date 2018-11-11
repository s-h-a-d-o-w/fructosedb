import * as React from 'react';
import styled from 'styled-components';
import screenfull from 'screenfull';

import theme from '../lib/theme';

const StyledIcon = styled.div`
	display: block;
	position: fixed;
	right: 0;
	bottom: 0;
	width: 3rem;
	height: 3rem;

	background-color: ${theme.primary};
	fill: white;
	padding: 0.5rem;

	${theme.largeDevices} {
		display: none;
	}
`;

type Props = {
	target: React.RefObject<HTMLElement>;
};

type State = {
	fullscreen: boolean;
};

export default class FullscreenButton extends React.Component<Props, State> {
	state = {
		fullscreen: false,
	};

	toggleFullScreen = (e) => {
		e.preventDefault();

		if (this.state.fullscreen) {
			screenfull.exit();
		} else {
			screenfull.request(this.props.target.current);
		}

		this.setState((prevState) => ({fullscreen: !prevState.fullscreen}));
	};

	render() {
		return (
			<StyledIcon onClick={this.toggleFullScreen}>
				{this.state.fullscreen ? (
					<svg width="100%" viewBox="0 0 20 20">
						<defs>
							<mask id="exitMask">
								<rect x="6" width="8" height="20" fill="white" />
								<rect y="6" width="20" height="8" fill="white" />
								<rect x="8" width="4" height="20" fill="black" />
								<rect y="8" width="20" height="4" fill="black" />
							</mask>
						</defs>
						<rect width="20" height="20" mask="url(#exitMask)" />
					</svg>
				) : (
					<svg width="100%" viewBox="0 0 20 20">
						<defs>
							<mask id="fsMask">
								<rect width="20" height="20" fill="white" />
								<rect x="2" y="2" width="16" height="16" fill="black" />
								<rect x="8" width="4" height="20" fill="black" />
								<rect y="8" width="20" height="4" fill="black" />
							</mask>
						</defs>
						<rect width="20" height="20" mask="url(#fsMask)" />
					</svg>
				)}
			</StyledIcon>
		);
	}
}
