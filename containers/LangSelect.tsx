import * as React from 'react';
import {connect} from 'react-redux';
import styled from 'styled-components';
// @ts-ignore
import DE from '../static/lang/de.svg';
// @ts-ignore
import US from '../static/lang/us.svg';

import {actions} from '../store/store.js';

const languages = {
	de: <DE key={'de'} data-key={'de'} />,
	en: <US key={'en'} data-key={'en'} />,
};

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

class LangSelect extends React.Component<any> {
	state = {
		expanded: false,
	};

	collapse = (e: any) => {
		if (
			e.target.closest('#langDropDown') !== null &&
			e.target.closest('svg') !== null
		)
			this.props.dispatchChangeLanguage(
				e.target.closest('svg').getAttribute('data-key')
			);

		this.setState({expanded: false});
		document.body.removeEventListener('click', this.collapse);
	};

	expand = () => {
		this.setState({expanded: true});
		document.body.addEventListener('click', this.collapse);
	};

	componentWillUnmount = () => {
		document.body.removeEventListener('click', this.collapse);
	};

	render = () => {
		return (
			<>
				<StyledFlag onClick={this.expand}>
					{languages[this.props.lang]}
					{this.state.expanded ? (
						<StyledDropDown
							id="langDropDown"
							numFlags={Reflect.ownKeys(languages).length}
						>
							{Reflect.ownKeys(languages)
								.sort((a) => (a !== this.props.lang ? 1 : 0))
								.map((key) => languages[key])}
						</StyledDropDown>
					) : (
						''
					)}
				</StyledFlag>
			</>
		);
	};
}

const mapStateToProps = ({lang}) => ({
	lang,
});

function dispatchChangeLanguage(dispatch, value) {
	dispatch(actions.changeLanguage(value));
}

const mapDispatchToProps = (dispatch) => ({
	dispatchChangeLanguage: dispatchChangeLanguage.bind(null, dispatch),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(LangSelect);
