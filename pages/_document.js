import Document, {Head, Main, NextScript} from 'next/document';
import {ServerStyleSheet} from 'styled-components';

// TODO: Add metadata to header

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
				<body style={{margin: 0}}>
					<Main />
					<NextScript />
				</body>
			</html>
		);
	}
}
