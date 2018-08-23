import React from 'react';
import styled from 'styled-components';

const StyledName: any = styled.td`
	text-overflow: ellipsis;
	overflow: hidden;
	white-space: nowrap;

	text-align: left;

	.tooltip {
		background-color: aliceblue;

		position: absolute;
		margin: 0 0 0 2vmin;
		max-width: 50vw;
		white-space: normal;

		visibility: hidden;
	}

	&:hover .tooltip {
		visibility: visible;
	}
`;

export class Table extends React.Component<any, any> {
	render() {
		let rows = [];
		for (let i = 0; i < this.props.data.length; i++) {
			let el = this.props.data[i];
			rows.push(
				<tr key={el.name}>
					<StyledName>
						{el.name}
						<div className="tooltip">{el.name}</div>
					</StyledName>
					<td>{el.nutrients[0].gm}</td>
					<td>{el.nutrients[1].gm}</td>
					<td>{el.nutrients[2].gm}</td>
				</tr>,
			);
		}

		return (
			<table style={{tableLayout: 'fixed', width: '100%'}}>
				<thead>
					<tr>
						<th style={{textAlign: 'left'}}>Name</th>
						<th>Fructose (per 100g)</th>
						<th>Sucrose (per 100g)</th>
						<th>Glucose (per 100g)</th>
					</tr>
				</thead>
				<tbody>{rows}</tbody>
			</table>
		);
	}
}
