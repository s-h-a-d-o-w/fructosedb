import * as React from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import theme from '../lib/theme';

const StyledA = styled.a`
	color: white;
	text-decoration: none;
	&:hover {
		color: ${theme.primaryLight};
		cursor: pointer;
	}
`;

type IProps = {
	children: React.ReactNode;
	href: string;
	target?: string;
};

// Next.js Link apparently injects href only into <a> child elements,
// not generic elements, such as styled components
export default (props: IProps) => (
	<Link prefetch href={props.href}>
		<StyledA target={props.target} href={props.href}>
			{props.children}
		</StyledA>
	</Link>
);
