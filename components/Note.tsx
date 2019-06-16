import styled from 'styled-components';

import theme from 'lib/theme';

/**
 * @component
 * @example ../docs/examples/Note.md
 */
export default styled.p`
	text-align: justify;
	text-indent: 1rem;

	background-color: white;
	color: ${theme.primary};
	padding: 1rem 1.5rem;
`;
