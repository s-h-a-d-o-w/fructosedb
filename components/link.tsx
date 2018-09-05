import Link from 'next/link';
import styled from 'styled-components';

const StyledA = styled.a`
	&:hover {
		color: ${(props) => props.theme.secondary};
		cursor: pointer;
	}
`;

export default (props) => (
	<Link prefetch href={props.href}>
		<StyledA>{props.children}</StyledA>
	</Link>
);
