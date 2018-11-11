import Document from 'next/document';
import {ServerStyleSheet} from 'styled-components';

// styled-components SSR support
// See: https://github.com/zeit/next.js/blob/canary/examples/with-styled-components/pages/_document.js
export default class MyDocument extends Document {
	static async getInitialProps(ctx) {
		const sheet = new ServerStyleSheet();

		const originalRenderPage = ctx.renderPage;
		ctx.renderPage = () =>
			originalRenderPage({
				enhanceApp: (App) => (props) => sheet.collectStyles(<App {...props} />),
			});

		const initialProps = await Document.getInitialProps(ctx);
		return {
			...initialProps,
			styles: [...initialProps.styles, ...sheet.getStyleElement()],
		};
	}
}
