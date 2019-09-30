import * as React from 'react';
import {FormattedMessage} from 'react-intl';

import {BaseLayout} from '../containers/BaseLayout';
import {CenteredContent} from '../components/CenteredContent';
import {Article} from '../components/Article';
import {Paragraph} from '../components/Paragraph';
import {Email} from '../containers/Email';

export default () => (
  <BaseLayout>
    <CenteredContent>
      <Article>
        <Paragraph>
          <FormattedMessage id="aboutCreator" />:{' '}
          <a
            target="_blank"
            href="https://www.linkedin.com/in/andreas-opferkuch/"
          >
            Andreas Opferkuch
          </a>
        </Paragraph>
        <Paragraph>
          <FormattedMessage id="aboutContactText" /> <Email />.
        </Paragraph>
      </Article>
    </CenteredContent>
  </BaseLayout>
);
