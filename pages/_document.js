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
					<style
						dangerouslySetInnerHTML={{
							__html: `
						/* box-sizing required for border to work within table */
						html {
							box-sizing: border-box;
							font-size: 100%;
						}
						*, *:before, *:after {
							box-sizing: inherit;
						}

						body {
							margin: 0;
						}

						@font-face {
							font-family: 'Roboto Slab';
							src: url('/static/fonts/roboto-slab.woff') format('woff'),
								url('/static/fonts/roboto-slab.woff2') format('woff2');
							font-display: block;
						}

						@font-face {
							font-family: 'Roboto Condensed';
							src: url('/static/fonts/roboto-condensed.woff') format('woff'),
								url('/static/fonts/roboto-condensed.woff2') format('woff2');
							font-display: block;
						}
					`,
						}}
					/>
					{this.props.styleTags}
				</Head>
				<body>
					<Main />
					<NextScript />
				</body>
			</html>
		);
	}
}
