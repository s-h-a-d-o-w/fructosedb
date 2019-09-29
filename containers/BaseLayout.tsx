import * as React from 'react';
import {useState, useEffect} from 'react';
import styled from 'styled-components';

import {Navigation} from 'containers/Navigation';
import theme from 'lib/theme';

import {Head as FructoseHead} from './Head';
import {Logo} from '../components/Logo';

type StyledBaseProps = {
	hasMounted: boolean;
};

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
	${(props: StyledBaseProps) =>
		props.hasMounted ? '' : '& > * {animation: fadeIn 500ms ease-in;}'};
`;

type Props = {
	onClick?: () => void;
	onTouchStart?: () => void;
};

export const BaseLayout: React.FC<Props> = ({children, ...restProps}) => {
	const [hasMounted, setHasMounted] = useState(false);

	useEffect(function() {
		setHasMounted(true);
	}, []);

	return (
		<>
			<FructoseHead />
			<StyledBase {...restProps} hasMounted={hasMounted}>
				<Logo />
				<Navigation />
				{children}
			</StyledBase>
		</>
	);
};
