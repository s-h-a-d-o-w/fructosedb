import * as React from 'react';
import {useCallback, useState} from 'react';
import styled from 'styled-components';
import {useRouter} from 'next/router';

import {Burger} from 'components/Burger';
import {Link} from '../components/Link';
import {NavigationContent} from 'components/NavigationContent';
import theme from 'lib/theme';
import {FormattedMessage} from 'react-intl';

const StyledSupport = styled.div`
  text-align: right;
  margin-top: 0.3rem;
  margin-right: 0.4rem;

  font-size: 0.9rem;

  ${theme.largeDevices} {
    margin-right: 1rem;

    font-size: 1.2rem;
  }
`;

const StyledLightbox = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 1000;

  background-color: black;
  opacity: 0.5;
`;

export const Navigation = React.memo(function Navigation() {
  const [showMenu, setShowMenu] = useState(false);
  const router = useRouter();

  const closeMenu = useCallback(() => setShowMenu(false), []);
  const openMenu = useCallback(() => setShowMenu(true), []);

  return (
    <>
      <Burger onClick={openMenu} />

      <div style={{gridArea: 'nav'}}>
        {showMenu && (
          <>
            <StyledLightbox onClick={closeMenu} />
            <NavigationContent onClick={closeMenu} desktop={false} />
          </>
        )}
        <NavigationContent desktop={true} />

        {router.pathname !== '/support' && (
          <StyledSupport>
            <Link href="/support">
              <FormattedMessage id="indexSupportUs" />
            </Link>
          </StyledSupport>
        )}
      </div>
    </>
  );
});
