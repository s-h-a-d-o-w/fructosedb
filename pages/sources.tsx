import * as React from 'react';
import BaseLayout from '../components/BaseLayout';
import CenteredContent from '../components/CenteredContent';
import styled from 'styled-components';

const StyledText = styled.article`
	padding: 0 2rem;
	line-height: 1.5rem;
`;

const StyledP = styled.p`
	text-align: justify;
	text-indent: 1rem;
`;

export default () => (
	<BaseLayout>
		<CenteredContent>
			<StyledText>
				<StyledP>
					Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed justo
					felis, imperdiet vel odio eget, mollis ultrices mauris. Pellentesque
					gravida a nunc vel egestas. Pellentesque bibendum, leo vitae venenatis
					convallis, orci diam imperdiet mi, ut tincidunt nisi justo in magna.
					In mollis bibendum sem, at volutpat quam commodo et. Nunc augue risus,
					posuere non augue vitae, placerat dignissim sapien. Nam in
					pellentesque purus. Aenean at facilisis neque.
				</StyledP>
				<StyledP>
					Praesent lorem erat, lobortis eu iaculis ut, placerat nec diam. Cras
					mollis, velit sed auctor ultrices, erat nibh aliquet sem, vitae auctor
					enim arcu semper lectus. Vestibulum pretium placerat nunc, vel
					efficitur ligula egestas vel. Quisque tortor nisl, rutrum quis
					fermentum id, lacinia id purus. Nullam a quam vitae lorem pretium
					dapibus. Vestibulum tincidunt rutrum tellus cursus dapibus. Integer id
					nunc velit.
				</StyledP>
				<StyledP>
					In tempor maximus leo eget vehicula. Donec nec ultricies tortor.
					Vivamus volutpat urna nec ex scelerisque facilisis. In a pellentesque
					leo. Vestibulum ac leo vel mauris mattis dictum. Morbi posuere
					dignissim feugiat. Suspendisse id vehicula ex, sit amet placerat
					massa. Mauris eu malesuada erat. Nunc feugiat est et justo elementum
					vehicula ut vitae magna. Pellentesque egestas felis vel velit
					vulputate malesuada at vitae nisi. In in tellus viverra, eleifend
					augue vitae, bibendum magna. Fusce hendrerit convallis rutrum.
				</StyledP>
			</StyledText>
		</CenteredContent>
	</BaseLayout>
);
