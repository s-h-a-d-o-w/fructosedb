import Document, {Head, Main, NextScript} from 'next/document';
import {ServerStyleSheet} from 'styled-components';
import styled from 'styled-components';

// TODO: Add metadata to header

const Body = styled.body`
	margin: 0;

	background-color: rebeccapurple;
	color: white;

	font-family: 'Lucida Sans Unicode', 'Lucida Grande', sans-serif;
	font-size: 0.9rem;

	input {
		min-width: 0.4rem;
		min-height: 0.4rem;
	}
`;

export default class MyDocument extends Document {
	static getInitialProps({renderPage}) {
		const sheet = new ServerStyleSheet();
		const page = renderPage((App) => (props) =>
			sheet.collectStyles(<App {...props} />)
		);
		const styleTags = sheet.getStyleElement();
		return {...page, styleTags};
	}

	render() {
		return (
			<html>
				<Head>
					<title>fructose.db</title>
					<meta name="viewport" content="width=device-width, initial-scale=1" />
					{this.props.styleTags}
				</Head>
				<Body>
					<Main />
					<NextScript />
				</Body>
			</html>
		);
	}
}
