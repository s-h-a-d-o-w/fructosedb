import styled from 'styled-components';

// Enforce a 1:1 aspect ratio so that spinner stays round
// even when using percentage for width/height.
const StyledAspectRatio = styled.div`
	position: relative;
	width: 100%;
	padding-bottom: 100%;
`;

const StyledAspectRatioWrapper = styled.div`
	position: absolute;
	top: 0;
	bottom: 0;
	left: 0;
	right: 0;

	display: flex;
	align-items: center;
	justify-content: center;
`;

const StyledIcon = styled.div`
	width: 20%;
	height: 20%;

	border: 8px rgba(255, 255, 255, 0.25) solid;
	border-top: 8px rgba(255, 255, 255, 1) solid;
	border-radius: 50%;
	-webkit-animation: spCircRot 1s infinite linear;
	animation: spCircRot 1s infinite linear;

	@-webkit-keyframes spCircRot {
		from {
			-webkit-transform: rotate(0deg);
		}
		to {
			-webkit-transform: rotate(359deg);
		}
	}

	@keyframes spCircRot {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(359deg);
		}
	}
`;

// Basically centered (moved up a bit for better visual balance), takes up 20% of the parent container
export default () => (
	<StyledAspectRatio>
		<StyledAspectRatioWrapper>
			<StyledIcon />
		</StyledAspectRatioWrapper>
	</StyledAspectRatio>
);
