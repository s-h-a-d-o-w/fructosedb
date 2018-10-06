import * as React from 'react';

import BaseLayout from '../components/BaseLayout';
import CenteredContent from '../components/CenteredContent';
import Article from '../components/Article';
import Paragraph from '../components/Paragraph';

export default () => (
	<BaseLayout>
		<CenteredContent>
			<Article>
				<Paragraph>
					Author:{' '}
					<a
						target="_blank"
						href="https://www.linkedin.com/in/andreas-opferkuch/"
					>
						Andreas Opferkuch
					</a>
				</Paragraph>
				<Paragraph>
					Especially medical professionals who find our information lacking for
					whatever reason are welcome to reach out at:{' '}
					<a href="mailto:&#x61;&#x6f;&#x40;&#x76;&#x61;&#x72;&#x69;&#x61;&#x74;&#x69;&#x6f;&#x6e;&#x73;&#x2d;&#x6f;&#x66;&#x2d;&#x73;&#x68;&#x61;&#x64;&#x6f;&#x77;&#x2e;&#x63;&#x6f;&#x6d;">
						&#x61;&#x6f;&#x40;&#x76;&#x61;&#x72;&#x69;&#x61;&#x74;&#x69;&#x6f;&#x6e;&#x73;&#x2d;&#x6f;&#x66;&#x2d;&#x73;&#x68;&#x61;&#x64;&#x6f;&#x77;&#x2e;&#x63;&#x6f;&#x6d;
					</a>
				</Paragraph>
			</Article>
		</CenteredContent>
	</BaseLayout>
);
