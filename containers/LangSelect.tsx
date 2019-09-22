import * as React from 'react';
import {useState} from 'react';
import {Dispatch} from 'redux';
import {connect} from 'react-redux';
import styled from 'styled-components';

import DE from '../static/lang/de.svg';
import US from '../static/lang/us.svg';
import {changeLanguage} from 'store/actions';
import {ReduxState} from 'store';
import {SupportedLanguages} from 'types';

type Props = ReturnType<typeof mapStateToProps> &
	ReturnType<typeof mapDispatchToProps>;

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

const languages = {
	de: <DE key={'de'} data-key={'de'} />,
	en: <US key={'en'} data-key={'en'} />,
};

const _LangSelect: React.FC<Props> = ({dispatchChangeLanguage, lang}) => {
	const [isExpanded, setIsExpanded] = useState(false);

	const collapse = (e: Event) => {
		if (e.target && e.target instanceof Element) {
			const svgElement = e.target.closest('#langDropDown > svg');
			if (svgElement !== null) {
				const lang = svgElement.getAttribute('data-key');
				if (lang && (lang === 'de' || lang === 'en')) {
					dispatchChangeLanguage(lang);
				}
			}
		}

		setIsExpanded(false);
		document.body.removeEventListener('click', collapse);
	};

	const expand = () => {
		setIsExpanded(true);
		document.body.addEventListener('click', collapse);
	};

	return (
		<>
			<StyledFlag onClick={expand}>
				{languages[lang]}
				{isExpanded ? (
					<StyledDropDown
						id="langDropDown"
						numFlags={Object.keys(languages).length}
					>
						{(Object.keys(languages) as (keyof typeof languages)[])
							.sort((a, b) => (a === lang ? -1 : b === lang ? 1 : 0))
							.map((key) => languages[key])}
					</StyledDropDown>
				) : (
					''
				)}
			</StyledFlag>
		</>
	);
};

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
export const LangSelect = connect(
	mapStateToProps,
	mapDispatchToProps
)(_LangSelect);
