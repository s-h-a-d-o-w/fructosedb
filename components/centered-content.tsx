import styled from 'styled-components';

const CenteredContent: any = styled.div`
	grid-area: ${(props: any) => props.gridArea};
	width: 100vw;
	max-width: 1000px;
	justify-self: center;
`;

export default CenteredContent;
