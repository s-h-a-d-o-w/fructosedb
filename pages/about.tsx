import * as React from 'react';

import BaseLayout from '../components/BaseLayout';
import CenteredContent from '../components/CenteredContent';
import Article from '../components/Article';
import Paragraph from '../components/Paragraph';
import Email from '../components/Email';

export default () => (
	<BaseLayout>
		<CenteredContent>
			<Article>
				<Paragraph>
					Creator:{' '}
					<a
						target="_blank"
						href="https://www.linkedin.com/in/andreas-opferkuch/"
					>
						Andreas Opferkuch
					</a>
				</Paragraph>
				<Paragraph>
					Especially medical professionals who find our information lacking for
					whatever reason are welcome to reach out via <Email />.
				</Paragraph>
			</Article>
		</CenteredContent>
	</BaseLayout>
);
