import * as React from 'react';
import {Dispatch} from 'redux';
import {connect} from 'react-redux';
import styled from 'styled-components';

import DE from '../static/lang/de.svg';
import US from '../static/lang/us.svg';
import {changeLanguage} from 'store/actions';
import {ReduxState} from 'store';
import {SupportedLanguages} from 'types';

const StyledFlag = styled.div`
	position: relative;

	margin-left: auto;
	margin-right: 0.3rem;
	width: 2rem;

	cursor: pointer;
`;

type DropDownProps = {
	numFlags: number;
} & React.HTMLProps<HTMLDivElement>;

const StyledDropDown = styled.div`
	position: absolute;
	left: 0;
	top: 0;
	z-index: 1000;

	width: 2rem;

	overflow-y: hidden;
	animation: moveIn 200ms ease-in;

	@keyframes moveIn {
		from {
			opacity: 0;
			max-height: 2rem;
		}
		to {
			opacity: 1;
			max-height: ${(props: DropDownProps) => props.numFlags * 2}rem;
		}
	}
`;

type Props = ReturnType<typeof mapStateToProps> &
	ReturnType<typeof mapDispatchToProps>;

type State = {
	expanded: boolean;
};

class LangSelect extends React.Component<Props, State> {
	static languages = {
		de: <DE key={'de'} data-key={'de'} />,
		en: <US key={'en'} data-key={'en'} />,
	};

	state = {
		expanded: false,
	};

	collapse = (e: Event) => {
		if (e.target && e.target instanceof HTMLElement) {
			const svgElement = e.target.closest('svg');
			if (e.target.closest('#langDropDown') !== null && svgElement !== null) {
				const lang = svgElement.getAttribute('data-key');
				if (lang && (lang === 'de' || lang === 'en')) {
					this.props.dispatchChangeLanguage(lang);
				}
			}

			this.setState({expanded: false});
			document.body.removeEventListener('click', this.collapse);
		}
	};

	expand = () => {
		this.setState({expanded: true});
		document.body.addEventListener('click', this.collapse);
	};

	componentWillUnmount = () => {
		document.body.removeEventListener('click', this.collapse);
	};

	render = () => (
		<>
			<StyledFlag onClick={this.expand}>
				{LangSelect.languages[this.props.lang]}
				{this.state.expanded ? (
					<StyledDropDown
						id="langDropDown"
						numFlags={Reflect.ownKeys(LangSelect.languages).length}
					>
						{(Reflect.ownKeys(
							LangSelect.languages
						) as (keyof typeof LangSelect.languages)[])
							.sort((a, b) =>
								a === this.props.lang ? -1 : b === this.props.lang ? 1 : 0
							)
							.map((key) => LangSelect.languages[key])}
					</StyledDropDown>
				) : (
					''
				)}
			</StyledFlag>
		</>
	);
}

const mapStateToProps = ({lang}: ReduxState) => ({
	lang,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
	dispatchChangeLanguage: (value: SupportedLanguages) =>
		dispatch(changeLanguage(value)),
});

/**
 * @example ../docs/examples/LangSelect.md
 */
export default connect(
	mapStateToProps,
	mapDispatchToProps
)(LangSelect);
