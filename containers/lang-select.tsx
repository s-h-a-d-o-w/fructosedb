import React from 'react';
import {connect} from 'react-redux';
import styled from 'styled-components';
// @ts-ignore
import DE from '../static/lang/de.svg';
// @ts-ignore
import US from '../static/lang/us.svg';

import {actions} from '../store/store.js';

const langMap = {
	de: <DE key={'de'} data-key={'de'} />,
	en: <US key={'en'} data-key={'en'} />,
};

const StyledMap = styled.div`
	position: relative;
	display: flex;
	flex-direction: column;
	align-items: center;

	margin-left: auto;
	width: 2rem;
`;

type IStyledDropDown = {
	numFlags: number;
} & React.HTMLProps<HTMLDivElement>;

const StyledDropDown = styled.div`
	position: absolute;
	left: 0;
	top: 0;
	z-index: 1000;

	width: 2rem;

	overflow-y: hidden;
	animation: moveIn 500ms cubic-bezier(0, 1, 0.5, 1);

	@keyframes moveIn {
		from {
			opacity: 0;
			max-height: 0;
		}
		to {
			opacity: 1;
			max-height: ${(props: IStyledDropDown) => props.numFlags * 2}rem;
		}
	}
`;

class LangSelect extends React.Component<any> {
	state = {
		expanded: false,
	};

	expand = () => {
		this.setState({expanded: true});

		// Handle selection (or user clicking outside)
		document.body.addEventListener('click', (e: any) => {
			if (
				e.target.closest('#langDropDown') !== null &&
				e.target.closest('svg') !== null
			)
				this.props.dispatchChangeLanguage(
					e.target.closest('svg').getAttribute('data-key')
				);

			this.setState({expanded: false});
		});
	};

	render = () => {
		return (
			<>
				<StyledMap onClick={this.expand}>
					{langMap[this.props.lang]}
					{this.state.expanded ? (
						<StyledDropDown
							id="langDropDown"
							numFlags={Reflect.ownKeys(langMap).length}
						>
							{Reflect.ownKeys(langMap)
								.sort((a) => (a !== this.props.lang ? 1 : 0))
								.map((key) => langMap[key])}
						</StyledDropDown>
					) : (
						''
					)}
				</StyledMap>
			</>
		);
	};
}

const mapStateToProps = ({lang}) => ({
	lang,
});

const mapDispatchToProps = (dispatch) => ({
	dispatchChangeLanguage: (value) => dispatch(actions.changeLanguage(value)),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(LangSelect);
