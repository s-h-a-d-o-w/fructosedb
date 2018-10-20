import * as React from 'react';
import styled from 'styled-components';
import {Logo} from './Logo';
import Navigation from '../containers/Navigation';
import FructoseHead from './Head';
import theme from '../lib/theme';

type IStyledBaseProps = {
	hasMounted: boolean;
} & IProps;

const StyledBase = styled.div`
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

	@keyframes fadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	/* 
		Due to SSR, the following syle is included with initial HTML.
		But once this has mounted, it should be dismissed because fade in effects  
		are only inteded to soften the inital page load.
	 */
	${(props: IStyledBaseProps) =>
		props.hasMounted ? '' : '& > * {animation: fadeIn 250ms ease-in;}'};
`;

type IProps = {
	children: React.ReactNode;
	onClick?: () => void;
	onTouchStart?: () => void;
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

	render() {
		let {children, ...restProps} = this.props;

		return (
			<>
				<FructoseHead />
				<StyledBase {...restProps} hasMounted={this.state.hasMounted}>
					<Logo />
					<Navigation />
					{children}
				</StyledBase>
			</>
		);
	}
}
