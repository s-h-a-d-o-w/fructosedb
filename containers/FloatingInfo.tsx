import * as React from 'react';
import {connect} from 'react-redux';
import styled from 'styled-components';

const StyledFloat = styled.div.attrs({
	// This prevents classes from being created with every change
	style: (props) => ({
		left: `${props.float ? props.float.x : 0}px`,
		top: `${props.float ? props.float.y - 30 : 0}px`,
	}),
})`
	font-family: 'Roboto Condensed', sans-serif;

	position: absolute;
	z-index: 10000;
	max-width: 30vw;

	background-color: white;
	color: black;

	pointer-events: none;
`;

type IProps = {
	float: {
		x?: number;
		y?: number;
		content?: string;
	};
};

// Always rendered (not as much adding/removing from DOM, more concise code),
// won't be visible if content is empty
const FloatingInfo = (props: IProps) => (
	<StyledFloat {...props}>{props.float ? props.float.content : ''}</StyledFloat>
);

const mapStateToProps = ({float}) => ({
	float,
});

export default connect(mapStateToProps)(FloatingInfo);