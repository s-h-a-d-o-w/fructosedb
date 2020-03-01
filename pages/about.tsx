import * as React from 'react';
import {FormattedMessage} from 'react-intl';

import {BaseLayout} from '../containers/BaseLayout';
import {CenteredContent} from '../components/CenteredContent';
import {Article} from '../components/Article';
import {Paragraph} from '../components/Paragraph';
import {Email} from '../containers/Email';

const About: React.FC = () => (
  <BaseLayout>
    <CenteredContent>
      <Article>
        <Paragraph>
          <FormattedMessage id="aboutCreator" />:{' '}
          <a
            href="https://www.linkedin.com/in/andreas-opferkuch/"
            rel="noopener noreferrer"
            target="_blank"
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

export default About;
