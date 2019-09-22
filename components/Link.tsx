import * as React from 'react';
import NextLink from 'next/link';
import styled from 'styled-components';

import theme from 'lib/theme';

export type Props = {
	children: React.ReactNode;
	href: string;
	onClick?: () => void;
	invert?: boolean;
	target?: string;
};

const StyledA = styled.a`
	color: ${(props: Props) => (props.invert ? theme.primaryLight : 'white')};
	text-decoration: none;
	&:hover {
		color: ${(props: Props) => (props.invert ? 'white' : theme.primaryLight)};
		cursor: pointer;
	}
`;

// Next.js Link apparently injects href only into <a> child elements,
// not generic elements, such as styled components
export const Link: React.FC<Props> = (props) => (
	<NextLink href={props.href}>
		<StyledA {...props} />
	</NextLink>
);
