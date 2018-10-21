import * as React from 'react';
import styled from 'styled-components';
import theme from '../lib/theme';

const Burger = styled.div`
	width: 3rem;
	height: 3rem;
	padding: 0.4rem;
	background-color: ${theme.primaryLight};

	display: flex;
	flex-direction: column;
	justify-content: space-evenly;
	align-items: center;

	.burgerLine {
		width: 1.9rem;
		height: 4px;
		background-color: ${theme.primaryDark};
	}
`;

const BurgerLine = styled.div`
	width: 1.9rem;
	height: 4px;
	background-color: ${theme.primaryDark};
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
	return (
		<Burger {...props}>
			<BurgerLine />
			<BurgerLine />
			<BurgerLine />
		</Burger>
	);
};
