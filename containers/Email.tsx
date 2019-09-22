import * as React from 'react';
import {useEffect, useState} from 'react';

export const Email: React.FC = () => {
	const [isObfuscated, setIsObfuscated] = useState(true);
	useEffect(function() {
		setIsObfuscated(false);
	}, []);

	function removeObfuscation() {
		setIsObfuscated(false);
	}

	return (
		<a
			href={
				isObfuscated
					? 'mailto:solomon.odonkoh@googleit.com'
					: 'mailto:ao@variations-of-shadow.com'
			}
			onClick={removeObfuscation}
			onContextMenu={removeObfuscation}
			onMouseOver={removeObfuscation}
		>
			📧
		</a>
	);
};
