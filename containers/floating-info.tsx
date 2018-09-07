import React from 'react';
import {connect} from 'react-redux';
import styled from 'styled-components';

const StyledFloat: any = styled.div.attrs({
	// This prevents classes from being created with every change
	style: (props) => ({
		left: `${props.float ? props.float.x : 0}px`,
		top: `${props.float ? props.float.y - 30 : 0}px`,
	}),
})`
	position: absolute;
	z-index: 10000;
	max-width: 30vw;

	background-color: white;
	color: black;

	pointer-events: none;
`;

const mapStateToProps = ({float}) => ({
	float,
});

export default connect(mapStateToProps)((props: any) => (
	<StyledFloat {...props}>{props.float ? props.float.content : ''}</StyledFloat>
));
