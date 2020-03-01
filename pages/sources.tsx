import * as React from 'react';
import {FormattedMessage} from 'react-intl';
import styled from 'styled-components';

import {BaseLayout} from '../containers/BaseLayout';
import {CenteredContent} from '../components/CenteredContent';
import {Article} from '../components/Article';
import {Paragraph} from '../components/Paragraph';
import {Note} from '../components/Note';

const StyledUSDASymbol = styled.img`
  width: 2rem;
  background-color: white;
  vertical-align: middle;
`;

const articleLink = (
  <a
    href="https://www.foodsmatter.com/miscellaneous_articles/sugar_sweeteners/articles/fructose-intol-joneja-09-14.html"
    rel="noopener noreferrer"
    target="_blank"
  >
    &quot;Fructose intolerance, including FODMAPs&quot;
  </a>
);
const usdaIcon = (
  <a href="https://www.usda.gov/" rel="noopener noreferrer" target="_blank">
    <StyledUSDASymbol alt="USDA" src="/static/images/usda-symbol.svg" />
  </a>
);
const usdaLink = (
  <a
    href="https://ndb.nal.usda.gov/ndb/search/list?home=true"
    rel="noopener noreferrer"
    target="_blank"
  >
    food composition database
  </a>
);
const wikipediaLink = (
  <a
    href="https://en.wikipedia.org/wiki/Fructose_malabsorption#Diet"
    rel="noopener noreferrer"
    target="_blank"
  >
    Wikipedia
  </a>
);

// react-intl formatter
// See: https://github.com/formatjs/react-intl/blob/master/docs/Components.md#rich-text-formatting
const strong = (msg: string) => <strong>{msg}</strong>;

const Sources: React.FC = () => (
  <BaseLayout>
    <CenteredContent>
      <Article>
        <Paragraph>
          <FormattedMessage
            id="sourcesDescription"
            values={{
              usdaIcon,
              usdaLink,
            }}
          />
        </Paragraph>
        <Paragraph>
          <FormattedMessage
            id="sourcesFormula"
            values={{
              articleLink,
              strong,
              wikipediaLink,
            }}
          />
        </Paragraph>
        <Note>
          <FormattedMessage id="sourcesNote" values={{strong}} />
        </Note>
        <Paragraph>
          <FormattedMessage id="sourcesRelativeNumbers" values={{strong}} />
        </Paragraph>
        <Paragraph>
          <FormattedMessage
            id="sourcesAbsoluteNumbers"
            values={{
              strong,
              usdaIcon,
            }}
          />
        </Paragraph>
      </Article>
    </CenteredContent>
  </BaseLayout>
);

export default Sources;
