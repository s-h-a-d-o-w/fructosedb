import * as React from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import theme from '../lib/theme';

type IProps = {
	children: React.ReactNode;
	href: string;
	invert?: boolean;
	target?: string;
};

const StyledA = styled.a`
	color: ${(props: IProps) => (props.invert ? theme.primaryLight : 'white')};
	text-decoration: none;
	&:hover {
		color: ${(props: IProps) => (props.invert ? 'white' : theme.primaryLight)};
		cursor: pointer;
	}
`;

// Next.js Link apparently injects href only into <a> child elements,
// not generic elements, such as styled components
export default (props: IProps) => (
	<Link prefetch href={props.href}>
		<StyledA {...props} />
	</Link>
);
