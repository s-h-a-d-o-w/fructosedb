import * as React from 'react';

export default class extends React.Component {
	state = {
		obfuscated: true,
	};

	removeObfuscation = () => {
		this.setState({obfuscated: false});
	};

	render() {
		return (
			<a
				href={
					this.state.obfuscated
						? 'mailto:solomon.odonkoh@googleit.com'
						: 'mailto:ao@variations-of-shadow.com'
				}
				onClick={this.removeObfuscation}
				onContextMenu={this.removeObfuscation}
				onMouseOver={this.removeObfuscation}
			>
				📧
			</a>
		);
	}
}
