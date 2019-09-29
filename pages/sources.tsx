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
		target="_blank"
		href="https://www.foodsmatter.com/miscellaneous_articles/sugar_sweeteners/articles/fructose-intol-joneja-09-14.html"
	>
		"Fructose intolerance, including FODMAPs"
	</a>
);
const usdaIcon = (
	<a target="_blank" href="https://www.usda.gov/">
		<StyledUSDASymbol src="/static/images/usda-symbol.svg" />
	</a>
);
const usdaLink = (
	<a target="_blank" href="https://ndb.nal.usda.gov/ndb/search/list?home=true">
		food composition database
	</a>
);
const wikipediaLink = (
	<a
		target="_blank"
		href="https://en.wikipedia.org/wiki/Fructose_malabsorption#Diet"
	>
		Wikipedia
	</a>
);

// react-intl formatter
// See: https://github.com/formatjs/react-intl/blob/master/docs/Components.md#rich-text-formatting
const strong = (msg: string) => <strong>{msg}</strong>;

export default () => (
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
