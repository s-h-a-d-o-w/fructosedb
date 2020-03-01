import * as React from 'react';
import {useState} from 'react';
import {useDispatch} from 'react-redux';
import styled from 'styled-components';

import {changeLanguage} from 'store/actions';
import {useTypedSelector} from 'store';

import DE from '../static/lang/de.svg';
import US from '../static/lang/us.svg';

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

/**
 * @example ../docs/examples/LangSelect.md
 */
export const LangSelect: React.FC = () => {
  const dispatch = useDispatch();
  const lang = useTypedSelector((state) => state.lang);

  const [isExpanded, setIsExpanded] = useState(false);

  const collapse = (e: Event) => {
    if (e.target && e.target instanceof Element) {
      const svgElement = e.target.closest('#langDropDown > svg');
      if (svgElement !== null) {
        const lang = svgElement.getAttribute('data-key');
        if (lang && (lang === 'de' || lang === 'en')) {
          // Changing the language will also unmount this Select, resulting in isExpanded
          // being reset.
          dispatch(changeLanguage(lang));
        }
      }
    }

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
