import {CenteredContent} from 'components/CenteredContent';
import {Loading} from 'components/Loading';
import {BaseLayout} from 'containers/BaseLayout';
import {FloatingInfo} from 'containers/FloatingInfo';
import {FoodsTable} from 'containers/FoodsTable';
import {FullscreenButton} from 'containers/FullscreenButton';
import {Options} from 'containers/Options';
import theme from 'lib/theme';
import {isEmptyObject} from 'lib/util';
import * as React from 'react';
import {useCallback, useEffect, useRef, useState} from 'react';
import {useIntl} from 'react-intl';
import {useDispatch} from 'react-redux';
import screenfull from 'screenfull';
import {useTypedSelector} from 'store';
import {hideFloat} from 'store/actions';
import styled from 'styled-components';
import SmallDisplayWarning from 'components/SmallDisplayWarning';

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
  }, [dispatch, float]);

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
            <SmallDisplayWarning />
          </FullscreenContainer>
        ) : (
          <Loading />
        )}
      </CenteredContent>
    </BaseLayout>
  );
};

export default Index;
