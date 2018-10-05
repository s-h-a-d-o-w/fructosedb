import * as React from 'react';
import {connect} from 'react-redux';
import 'react-virtualized/styles.css';

import BaseLayout from '../components/BaseLayout';
import CenteredContent from '../components/CenteredContent';
import Loading from '../components/Loading';
import fetch from '../lib/fetch-with-timeout';
import TranslationDropdown from '../containers/TranslationDropdown';
import Head from 'next/head';

interface IState {
	data: any[];
	translatedKeys: PropertyKey[];
	hasMounted: boolean;
}

class Translate extends React.Component<any, IState> {
	refData = React.createRef<HTMLPreElement>();
	state = {
		hasMounted: false,
		translatedKeys: [],
		data: [],
	};

	static props = {
		langTranslate: 'en',
	};

	getData = async () => {
		const res = await fetch(`${process.env.BACKEND_URL}/list`);
		const data = {};
		(await res.json()).forEach((el) => (data[el.name] = null));

		this.setState({data: Reflect.ownKeys(data)});
	};

	getTranslation = async () => {
		const res = await fetch(
			`${process.env.BACKEND_URL}/static/lang/${this.props.langTranslate}.json`
		);

		if (res.status === 200)
			this.setState({translatedKeys: Reflect.ownKeys(await res.json())});
		else this.setState({translatedKeys: []});
	};

	componentDidMount() {
		// Options are meaningless if the user can't do anything with them.
		// But they'd still show long before the table due to SSR.
		this.setState({
			hasMounted: true,
		});
		this.getData();
	}

	componentDidUpdate(prevProps) {
		if (
			this.props.langTranslate != prevProps.langTranslate &&
			this.props.langTranslate !== ''
		)
			this.getTranslation();
	}

	copyToClipboard = () => {
		const el = document.createElement('textarea');
		el.value = this.refData.current.innerText;
		el.setAttribute('readonly', '');
		el.style.position = 'absolute';
		el.style.left = '-9999px';
		document.body.appendChild(el);
		el.select();
		document.execCommand('copy');
		document.body.removeChild(el);
	};

	render() {
		// Arrange all keys that still need translating in a JSON structure
		const keysToTranslate =
			this.props.langTranslate === 'en' || this.props.langTranslate === ''
				? ''
				: this.state.data
						.filter((el) => !this.state.translatedKeys.includes(el))
						.sort((a: string, b: string) => a.localeCompare(b))
						.map((el, idx) => {
							let quotesEscaped = el.replace(/([0-9])"/g, '$1\\"');
							return (
								<div key={quotesEscaped}>
									{'  '}
									<span className="notranslate">"{quotesEscaped}" : "</span>
									{quotesEscaped}
									<span className="notranslate">
										"{idx < this.state.data.length - 1 ? ',' : ''}
									</span>
									<br />
								</div>
							);
						});

		return (
			<BaseLayout>
				<Head>
					<script src="/static/google-translate.js" />
				</Head>
				<CenteredContent>
					<TranslationDropdown />
					<div className="notranslate">
						<br />
						<div style={{border: '2px solid white', padding: '1rem'}}>
							Step 1: Scroll to the bottom, since Google will only translate
							visible text.
							<br />
							Step 2:{' '}
							<button onClick={this.copyToClipboard}>Copy to Clipboard</button>
							<br />
							Step 3: Paste into a file called language.json.
							<br />
							Step 4: Replace oddities like \“ or whatever Google makes out of
							it by the correct \".
							<br />
							Step 5: Proofread.
						</div>
						<br />
						Missing translations for '{this.props.langTranslate}
						':
						<br />
					</div>
					{this.state.hasMounted ? (
						<pre ref={this.refData}>
							&#123;
							<span>{keysToTranslate}</span>
							&#125;
						</pre>
					) : (
						<Loading />
					)}
				</CenteredContent>
			</BaseLayout>
		);
	}
}

const mapStateToProps = ({langTranslate}) => ({langTranslate});

export default connect(mapStateToProps)(Translate);
