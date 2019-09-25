import * as React from 'react';
import {useCallback, useState} from 'react';
import styled from 'styled-components';

import {Burger} from 'components/Burger';
// import {Link} from '../components/Link';
import {NavigationContent} from 'components/NavigationContent';

/*
const StyledSupport = styled.nav`
	text-align: right;

	${theme.largeDevices} {
		font-size: 1.5rem;
	}
`;
*/

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

export const Navigation = React.memo(() => {
	const [showMenu, setShowMenu] = useState(false);

	const closeMenu = useCallback(() => setShowMenu(false), []);
	const openMenu = useCallback(() => setShowMenu(true), []);

	return (
		<>
			<Burger onClick={openMenu} />
			{showMenu && (
				<>
					<StyledLightbox onClick={closeMenu} />
					<NavigationContent onClick={closeMenu} desktop={false} />
				</>
			)}
			<NavigationContent desktop={true} />
			{/*
				<StyledSupport>
					<Link target="_blank" href="/support">
						❤️Support Us
					</Link>
				</StyledSupport>
				*/}
		</>
	);
});
