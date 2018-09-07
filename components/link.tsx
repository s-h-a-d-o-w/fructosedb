import Link from 'next/link';
import styled from 'styled-components';

const StyledA = styled.a`
	color: white;
	&:hover {
		color: ${(props) => props.theme.primaryLight};
		cursor: pointer;
	}
`;

export default (props) => (
	<Link prefetch href={props.href}>
		<StyledA>{props.children}</StyledA>
	</Link>
);
