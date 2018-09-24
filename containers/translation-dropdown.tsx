import React from 'react';
import {connect} from 'react-redux';
import {actions} from '../store/store.js';

type HTMLInputEvent = {
	target: HTMLInputElement;
} & Event;

class TranslationDropdown extends React.Component<any> {
	handleChange = (event: HTMLInputEvent) => {
		this.props.dispatch(actions.changeTranslationTarget(event.target.value));
	};

	componentDidMount() {
		let that = this;

		// google-translate.js fetches external assets from Google, which
		// may take a while...
		(function waitForGoogleTranslate() {
			if ((window as any).google.translate.TranslateElement) {
				new (window as any).google.translate.TranslateElement(
					{pageLanguage: 'en'},
					'google_translate_element'
				);

				document
					.getElementsByClassName('goog-te-combo')[0]
					.addEventListener('change', that.handleChange);

				return;
			}

			setTimeout(waitForGoogleTranslate, 100);
		})();
	}

	render() {
		return <div id="google_translate_element" />;
	}
}

export default connect()(TranslationDropdown);
