import * as React from 'react';
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

export default () => (
	<BaseLayout>
		<CenteredContent>
			<Article>
				<Paragraph>
					Data is provided by the{' '}
					<a target="_blank" href="https://www.usda.gov/">
						<StyledUSDASymbol src="/static/images/usda-symbol.svg" />
					</a>{' '}
					through their{' '}
					<a
						target="_blank"
						href="https://ndb.nal.usda.gov/ndb/search/list?home=true"
					>
						food composition database
					</a>{' '}
					and updated once a day. (Should new foods be added, translations may
					lag behind, as they are hand-crafted)
				</Paragraph>
				<Paragraph>
					The formula for calculating whether it is recommended to avoid a given
					food or not was derived from the article{' '}
					<a
						target="_blank"
						href="https://www.foodsmatter.com/miscellaneous_articles/sugar_sweeteners/articles/fructose-intol-joneja-09-14.html"
					>
						"Fructose intolerance, including FODMAPs"
					</a>{' '}
					by Dr. Janice Joneja and is a combination of <strong>relative</strong>{' '}
					and <strong>absolute</strong> fructose content. See also{' '}
					<a
						target="_blank"
						href="https://en.wikipedia.org/wiki/Fructose_malabsorption#Diet"
					>
						Wikipedia
					</a>{' '}
					for complementary sources.
				</Paragraph>
				<Note>
					<strong>NOTE</strong> Severity of issues from fructose consumption
					depend on quantity, time (to digest) and varies from person to person.
					So the most important thing is not necessarily the fructose content of
					specific food but how much you eat of it during one meal. For
					instance, raisins are generally considered harmful but if your degree
					of malabsorption allows it, you may be fine sprinkling 10 pieces or so
					on top of a porridge that is mostly free of sugar otherwise. And if
					you eat no other sugar during this meal.
				</Note>
				<Paragraph>
					The <strong>relative</strong> content is measured compared to glucose.
					So related to the F/G ratio in the table. If fructose exceeds glucose
					by 0.5g, the food is not recommended. (Sucrose is factored into this)
				</Paragraph>
				<Paragraph>
					The <strong>absolute</strong> content is measured based on what the{' '}
					<a target="_blank" href="https://www.usda.gov/">
						<StyledUSDASymbol src="/static/images/usda-symbol.svg" />
					</a>{' '}
					declares to be the serving size (fructose should not exceed more than
					3g per meal). Which may not be based on average eating habits. E.g.
					who eats 1 cup of raisins in one sitting? Unfortunately, we don't have
					the staff to manually curate what would be more reasonable serving
					sizes.
				</Paragraph>
			</Article>
		</CenteredContent>
	</BaseLayout>
);
