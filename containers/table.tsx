import React from 'react';
import styled from 'styled-components';

const StyledRow: any = styled.tr`
	.foodname {
		text-overflow: ellipsis;
		overflow: hidden;
		white-space: nowrap;

		text-align: left;
	}

	.foodname .tooltip {
		background-color: aliceblue;
		position: absolute;
		/* TODO: Use viewport units */
		margin: -35px 0px 0px 8px;
		visibility: hidden;
	}

	.foodname:hover .tooltip {
		visibility: visible;
	}
`;

export class Table extends React.Component<any, any> {
	render() {
		let rows = [];
		for (let i = 0; i < this.props.data.length; i++) {
			let el = this.props.data[i];
			rows.push(
				<StyledRow key={el.name} tooltip={el.name}>
					<td className="foodname">
						{el.name}
						<div className="tooltip">{el.name}</div>
					</td>
					<td>{el.nutrients[0].gm}</td>
					<td>{el.nutrients[1].gm}</td>
					<td>{el.nutrients[2].gm}</td>
				</StyledRow>,
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
