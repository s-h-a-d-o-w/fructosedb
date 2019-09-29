import * as React from 'react';
import {useEffect, useState} from 'react';

export const Email: React.FC = () => {
	const [isObfuscated, setIsObfuscated] = useState(true);

	useEffect(function() {
		setIsObfuscated(false);
	}, []);

	return (
		<a
			href={
				isObfuscated
					? 'mailto:solomon.odonkoh@googleit.com'
					: 'mailto:ao@variations-of-shadow.com'
			}
		>
			📧
		</a>
	);
};
