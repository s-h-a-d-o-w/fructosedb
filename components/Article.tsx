import styled from 'styled-components';
import theme from '../lib/theme';

export default styled.article`
	padding: 0 2rem;
	line-height: 1.5rem;

	a:link,
	a:visited {
		color: ${theme.primaryLight};
		text-decoration: none;
	}

	a:hover,
	a:active {
		color: white;
		text-decoration: underline;
	}
`;
