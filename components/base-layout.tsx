import styled from 'styled-components';
import {Logo} from './logo';
import Navigation from './navigation';
import React from 'react';
import theme from '../lib/theme';

type IStyledBaseProps = {
	hasMounted: boolean;
} & IProps;

const StyledBase = styled<IStyledBaseProps, any>('div')`
	display: grid;
	min-height: 100vh;

	grid-template-columns: 1fr auto 1fr;
	grid-template-rows: auto 1fr;
	grid-gap: 0.5rem 1rem;
	grid-template-areas:
		'. logo nav'
		'content content content';

	background-color: ${theme.primary};
	color: white;

	font-family: 'Roboto Slab', serif;

	input {
		min-width: 0.4rem;
		min-height: 0.4rem;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	${(props) =>
		props.hasMounted ? '' : '& > * {animation: fadeIn 250ms ease-in;}'};
`;

type IProps = {
	children: React.ReactNode;
	onClick?: () => void;
};

export default class BaseLayout extends React.Component<IProps> {
	state = {
		hasMounted: false,
	};

	componentDidMount() {
		this.setState({
			hasMounted: true,
		});
	}

	render = () => (
		<StyledBase {...this.props} hasMounted={this.state.hasMounted}>
			<Logo />
			<Navigation />
			{this.props.children}
		</StyledBase>
	);
}
