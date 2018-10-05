import * as React from 'react';
import styled from 'styled-components';
import theme from '../lib/theme';

const Burger = styled.div`
	width: 3rem;
	height: 3rem;

	font-size: 2rem;
	font-weight: bold;
	background-color: ${theme.primaryLight};
	color: ${theme.primaryDark};

	display: flex;
	justify-content: center;
	align-items: center;
`;

type Props = {
	onClick: () => void;
};

/**
 * Used to toggle mobile menu.
 * @param props
 * @example ../docs/examples/Burger.md
 */
export default (props: Props) => {
	return <Burger {...props}>☰</Burger>;
};
