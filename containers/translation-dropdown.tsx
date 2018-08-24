import React from 'react';

export class TranslationDropdown extends React.Component {
	componentDidMount() {
		// google-translate.js fetches external assets from Google, which
		// may take a while...
		(function waitForGoogleTranslate() {
			if ((window as any).google.translate.TranslateElement) {
				new (window as any).google.translate.TranslateElement(
					{pageLanguage: 'en'},
					'google_translate_element'
				);

				return;
			}

			setTimeout(waitForGoogleTranslate, 100);
		})();
	}

	render() {
		return (
			<div
				id="google_translate_element"
				style={{
					position: 'absolute',
					right: '1vmin',
					top: '1vmin',
				}}
			/>
		);
	}
}
