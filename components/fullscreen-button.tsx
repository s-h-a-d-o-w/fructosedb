import React from 'react';
import styled from 'styled-components';

const StyledIcon = styled.div`
	display: block;
	position: fixed;
	right: 0;
	bottom: 0;
	width: 2rem;
	height: 2rem;

	background-color: ${(props) => props.theme.primary};
	fill: white;
	padding: 0.3rem;

	${(props) => props.theme.largeDevices} {
		display: none;
	}
`;

export default class FullscreenButton extends React.Component<any> {
	state = {
		fullscreen: false,
	};

	toggleFullScreen = () => {
		if (this.state.fullscreen) {
			if (document.webkitExitFullscreen) document.webkitExitFullscreen();
			else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
			else if (document.msExitFullscreen) document.msExitFullscreen();
			else if (document.exitFullscreen) document.exitFullscreen();

			this.setState({fullscreen: false});
		} else {
			let elem: HTMLElement = this.props.target.current;
			if (elem.requestFullscreen) {
				elem.requestFullscreen();
			} else if (elem.msRequestFullscreen) {
				elem.msRequestFullscreen();
			} else if (elem.mozRequestFullScreen) {
				elem.mozRequestFullScreen();
			} else if (elem.webkitRequestFullscreen) {
				elem.webkitRequestFullscreen();
			}

			this.setState({fullscreen: true});
		}
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

declare global {
	interface Document {
		exitFullscreen: () => void;
		msExitFullscreen: () => void;
		mozCancelFullScreen: () => void;
		webkitExitFullscreen: () => void;
	}

	interface HTMLElement {
		msRequestFullscreen: any;
		mozRequestFullScreen: any;
	}
}
