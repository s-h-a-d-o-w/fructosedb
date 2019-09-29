import * as React from 'react';
import {useCallback, useEffect, useRef, useState} from 'react';
import {useIntl} from 'react-intl';
import {useDispatch} from 'react-redux';
import screenfull from 'screenfull';
import styled from 'styled-components';

import {BaseLayout} from 'containers/BaseLayout';
import {CenteredContent} from 'components/CenteredContent';
import {Loading} from 'components/Loading';
import {FloatingInfo} from 'containers/FloatingInfo';
import {FullscreenButton} from 'containers/FullscreenButton';
import {Options} from 'containers/Options';
import {FoodsTable} from 'containers/FoodsTable';
import theme from 'lib/theme';
import {isEmptyObject} from 'lib/util';
import {hideFloat} from 'store/actions';
import {useTypedSelector} from 'store';

const FullscreenContainer = styled.div`
	/* If background-color isn't set, :-webkit-full-screen (default: white) will be aplied */
	background-color: ${theme.primary};
	width: 100%;
	height: 100%;

	/* Make it possible for table to use 100% height without overflowing this container */
	display: flex;
	flex-direction: column;
`;

const Index: React.FC = () => {
	console.log('index.tsx');

	const dispatch = useDispatch();
	const float = useTypedSelector((state) => state.float);
	const lang = useTypedSelector((state) => state.lang);

	const [hasMounted, setHasMounted] = useState(false);

	const intl = useIntl();

	const refContent = useRef(null);

	useEffect(() => {
		setHasMounted(true);
	}, []);

	const dispatchHideFloat = useCallback(() => {
		if (float && !isEmptyObject(float)) {
			dispatch(hideFloat());
		}
	}, [dispatch]);

	return (
		<BaseLayout onClick={dispatchHideFloat} onTouchStart={dispatchHideFloat}>
			<CenteredContent>
				{hasMounted &&
				// When locale and language aren't in sync, rendering doesn't make sense and
				// causes unnecessary fetches.
				// This happens when a user's language selection is different from their browser's
				// locale.
				intl.locale === lang ? (
					/* Containers that use gridArea can't be made to use
						fullscreen as expected, a nested container is required. */
					<FullscreenContainer ref={refContent}>
						<Options />
						<FoodsTable />
						{screenfull.isEnabled ? (
							<FullscreenButton screenfull={screenfull} target={refContent} />
						) : (
							''
						)}
						<FloatingInfo />
					</FullscreenContainer>
				) : (
					<Loading />
				)}
			</CenteredContent>
		</BaseLayout>
	);
};

export default Index;
