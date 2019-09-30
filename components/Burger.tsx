import * as React from 'react';
import styled from 'styled-components';

import theme from 'lib/theme';

type Props = {
  onClick: () => void;
};

const StyledBurgerContainer = styled.button`
  border: 0;
  cursor: pointer; // In case of small window on desktop
  background-color: ${theme.primaryLight};

  position: fixed;
  left: 0;
  top: 0;

  width: 3rem;
  height: 3rem;
  padding: 0.4rem;

  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;

  ${theme.largeDevices} {
    display: none;
  }
`;

const StyledBurgerLine = styled.div`
  width: 1.9rem;
  height: 4px;
  background-color: ${theme.primaryDark};
`;

export const Burger = React.memo(({onClick}: Props) => (
  <StyledBurgerContainer onClick={onClick}>
    <StyledBurgerLine />
    <StyledBurgerLine />
    <StyledBurgerLine />
  </StyledBurgerContainer>
));
