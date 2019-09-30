import * as React from 'react';
import styled from 'styled-components';

import {useTypedSelector} from 'store';

export const VERTICAL_OFFSET = 30;

const StyledFloat = styled.div`
  font-family: 'Roboto Condensed', sans-serif;

  position: absolute;
  z-index: 10000;
  max-width: 30vw;
  padding: 0.5vw;

  background-color: white;
  color: black;

  pointer-events: none;
`;

export const FloatingInfo: React.FC = () => {
  const float = useTypedSelector((state) => state.float);

  return float ? (
    <StyledFloat
      style={{
        left: float.x,
        top: float.y - VERTICAL_OFFSET,
      }}
    >
      {float.content}
    </StyledFloat>
  ) : null;
};
