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

// Next.js Link apparently injects href only into <a> child elements,
// not generic elements, such as styled components
export default (props) => (
	<Link prefetch href={props.href}>
		<StyledA href={props.href}>{props.children}</StyledA>
	</Link>
);
