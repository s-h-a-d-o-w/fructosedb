import * as React from 'react';
import {useDispatch} from 'react-redux';
import styled from 'styled-components';

import theme from 'lib/theme';
import {useTypedSelector} from 'store';
import {changeFilter, toggleFruit, toggleServing} from 'store/actions';

import {LangSelect} from './LangSelect';
import {FormattedMessage} from 'react-intl';

const StyledOptions = styled.div`
  display: flex;
  align-items: center;

  margin-bottom: 0.3rem;
  margin-top: 0.3rem;

  font-size: 0.8rem;
  ${theme.largeDevices} {
    font-size: inherit;
  }

  input {
    margin-left: 0.5rem;
  }

  input[type='checkbox'] {
    position: relative;
    top: 1px;

    width: 1.2em;
    height: 1.2em;
  }

  label {
    white-space: nowrap;
  }
`;

const StyledTextBox = styled.input`
  font-family: inherit;
  font-size: inherit;

  width: 7.5rem;
  ${theme.largeDevices} {
    width: 10rem;
  }
`;

export const Options: React.FC = React.memo(() => {
  const dispatch = useDispatch();

  const filter = useTypedSelector((state) => state.filter);
  const onlyFruit = useTypedSelector((state) => state.onlyFruit);
  const showServingSize = useTypedSelector((state) => state.showServingSize);

  return (
    <StyledOptions>
      <input
        type="checkbox"
        id="showServing"
        checked={showServingSize}
        onChange={() => dispatch(toggleServing())}
      />
      <label htmlFor="showServing">
        <FormattedMessage id="optionsPerServing" />
      </label>
      <input
        type="checkbox"
        id="onlyFruit"
        checked={onlyFruit}
        onChange={() => dispatch(toggleFruit())}
      />
      <label htmlFor="onlyFruit">
        <FormattedMessage id="optionsOnlyFruit" />
      </label>
      <StyledTextBox
        type="text"
        placeholder="Filter"
        onChange={(e) => {
          dispatch(changeFilter(e.target.value));
        }}
        value={filter}
      />
      <LangSelect />
    </StyledOptions>
  );
});
