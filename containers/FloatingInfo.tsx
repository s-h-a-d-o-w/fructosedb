import * as React from 'react';
import {connect} from 'react-redux';
import styled from 'styled-components';

import {ReduxState} from 'store';

export const VERTICAL_OFFSET = 30;

const StyledFloat = styled.div`
	font-family: 'Roboto Condensed', sans-serif;

	position: absolute;
	z-index: 10000;
	max-width: 30vw;
	padding: 0.5vw;

	background-color: white;
	color: black;

	pointer-events: none;
`;

type Props = ReturnType<typeof mapStateToProps>;

// Always rendered (not as much adding/removing from DOM, more concise code),
// won't be visible if content is empty
const FloatingInfo: React.FC<Props> = (props) =>
	props.float ? (
		<StyledFloat
			style={{
				left: props.float.x,
				top: props.float.y - VERTICAL_OFFSET,
			}}
		>
			{props.float.content}
		</StyledFloat>
	) : null;

const mapStateToProps = ({float}: ReduxState) => ({
	float,
});

export default connect(mapStateToProps)(FloatingInfo);
