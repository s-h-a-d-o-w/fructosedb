import Link from 'next/link';
import styled from 'styled-components';

const StyledA = styled.a`
	color: white;
	text-decoration: none;
	&:hover {
		color: ${(props) => props.theme.primaryLight};
		cursor: pointer;
	}
`;

// Next.js Link apparently injects href only into <a> child elements,
// not generic elements, such as styled components
export default (props) => (
	<Link prefetch href={props.href}>
		<StyledA href={props.href}>{props.children}</StyledA>
	</Link>
);
