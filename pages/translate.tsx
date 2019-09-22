import * as React from 'react';
import {connect} from 'react-redux';
import Head from 'next/head';

import {BaseLayout} from '../containers/BaseLayout';
import {CenteredContent} from '../components/CenteredContent';
import {Loading} from '../components/Loading';
import {fetch} from '../lib/fetch-with-timeout';
import TranslationDropdown from '../containers/TranslationDropdown';
import {Link} from '../components/Link';
import {Email} from '../containers/Email';
import {FoodCache} from 'types';
import {ReduxState} from 'store';

type State = {
	foodNames: string[];
	hasMounted: boolean;
	translatedKeys: string[];
};

type Props = {
	langTranslate: string;
};

class Translate extends React.Component<Props, State> {
	refData = React.createRef<HTMLPreElement>();
	state: State = {
		foodNames: [],
		hasMounted: false,
		translatedKeys: [],
	};

	getData = async () => {
		const res = await fetch('list');

		const uniqueFoodNames: {[key: string]: null} = {};
		((await res.json()) as FoodCache).forEach(
			(food) => (uniqueFoodNames[food.name] = null)
		);

		this.setState({foodNames: Object.keys(uniqueFoodNames)});
	};

	getTranslation = async () => {
		const res = await fetch(`static/lang/${this.props.langTranslate}.json`);

		if (res.status === 200)
			this.setState({translatedKeys: Object.keys(await res.json())});
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

	componentDidUpdate(prevProps: Props) {
		if (
			this.props.langTranslate != prevProps.langTranslate &&
			this.props.langTranslate !== ''
		)
			this.getTranslation();
	}

	copyToClipboard = () => {
		if (this.refData.current) {
			const el = document.createElement('textarea');

			el.value = this.refData.current.innerText;
			el.setAttribute('readonly', '');
			el.style.position = 'absolute';
			el.style.left = '-9999px';

			document.body.appendChild(el);
			el.select();
			document.execCommand('copy');
			document.body.removeChild(el);
		}
	};

	render() {
		// Arrange all keys that still need translating in a JSON structure
		const keysToTranslate =
			this.props.langTranslate === 'en' || this.props.langTranslate === ''
				? ''
				: this.state.foodNames
						.filter((el) => !this.state.translatedKeys.includes(el))
						.sort((a: string, b: string) => a.localeCompare(b))
						.map((el) => {
							let quotesEscaped = el.replace(/([0-9])"/g, '$1\\"');
							return (
								<div key={quotesEscaped}>
									{'  '}
									<span className="notranslate">"{quotesEscaped}" : "</span>
									{quotesEscaped}
									<span className="notranslate">",</span>
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
							Step 3: Paste into a file called &lt;language-code&gt;.json.
							<br />
							Step 4: Replace oddities like \“ or whatever Google makes out of
							it with the correct \".
							<br />
							Step 5: Proofread.
							<br />
							Step 6: Commit{' '}
							<Link
								invert
								target="_blank"
								href="https://github.com/s-h-a-d-o-w/fructosedb/tree/master/static/lang"
							>
								here
							</Link>{' '}
							or send it to us via <Email />.
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

const mapStateToProps = ({langTranslate}: ReduxState) => ({langTranslate});

export default connect(mapStateToProps)(Translate);
