import React from 'react';
import styled from 'styled-components';
import theme from 'lib/theme';
import {FormattedMessage} from 'react-intl';

const fillContainer = `
position: absolute;
left: 0;
top: 0;
width: 100vw;
height: 100vh;
`;

const StyledSmallDisplayWarning = styled.div`
  display: none;

  @media (orientation: portrait) and (max-width: 350px) {
    ${fillContainer}

    display: block;
  }
`;

const StyledLightbox = styled.div`
  ${fillContainer}

  background-color: white;
  opacity: 0.75;
`;

const StyledContent = styled.div`
  ${fillContainer}

  display: flex;
  justify-content: center;
  align-items: center;

  color: ${theme.primaryDark};
`;

const StyledH1 = styled.h1`
  margin: 2rem;
  text-align: center;
`;

const SmallDisplayWarning: React.FC = () => {
  return (
    <StyledSmallDisplayWarning>
      <StyledLightbox />
      <StyledContent>
        <StyledH1>
          <FormattedMessage id="indexSmallDisplayWarning" />
        </StyledH1>
      </StyledContent>
    </StyledSmallDisplayWarning>
  );
};

export default SmallDisplayWarning;
