import * as React from 'react';
import {FormattedMessage} from 'react-intl';

import {BaseLayout} from 'containers/BaseLayout';
import {CenteredContent} from 'components/CenteredContent';
import {Article} from 'components/Article';
import {Paragraph} from 'components/Paragraph';
import styled from 'styled-components';

const StyledH2 = styled.h2`
  font-weight: normal;
  margin-top: 3rem;
`;

const Support: React.FC = () => (
  <BaseLayout>
    <CenteredContent>
      <Article>
        <Paragraph>
          <FormattedMessage id="supportThanks" />
        </Paragraph>
        <div style={{textAlign: 'center'}}>
          <StyledH2>
            <FormattedMessage id="supportSubscription" />
          </StyledH2>
          <a
            href="https://www.patreon.com/fructosedb"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="/static/images/patreon.png"
              alt="Patreon badge"
              style={{width: '12rem'}}
            />
          </a>
          <StyledH2>
            <FormattedMessage id="supportOneTimeDonation" />
          </StyledH2>
          <a
            href="https://paypal.me/aopsoftware"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="/static/images/paypal.jpg"
              alt="PayPal logo"
              style={{width: '7rem'}}
            />
          </a>
        </div>
      </Article>
    </CenteredContent>
  </BaseLayout>
);

export default Support;
