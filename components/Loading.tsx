import * as React from 'react';
import styled from 'styled-components';

const StyledFillContainer = styled.div`
	display: flex;
	width: 100%;
	height: 100%;

	justify-content: center;
`;

// From: https://codepen.io/bernethe/pen/dorozd
const StyledIcon = styled.div`
	width: 4rem;
	height: 4rem;
	margin-top: 20vh;

	border: 0.5rem rgba(255, 255, 255, 0.25) solid;
	border-top: 0.5rem rgba(255, 255, 255, 1) solid;
	border-radius: 50%;
	animation: delayStart 2s, spCircRot 1s infinite linear;

	/* Prevent brief showing of this for fast connections */
	@keyframes delayStart {
		0% {
			opacity: 0;
		}
		50% {
			opacity: 0;
		}
		100% {
			opacity: 1;
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

export default () => (
	<StyledFillContainer>
		<StyledIcon />
	</StyledFillContainer>
);
