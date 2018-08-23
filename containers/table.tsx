import React from 'react';
import styled from 'styled-components';
import memoize from 'memoize-one';

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
	sortData = memoize(
		(data: Array<object>, orderBy) =>
			typeof orderBy === 'string'
				? data.sort((a, b) => a[orderBy].localeCompare(b[orderBy]))
				: data.sort((a, b) => a[orderBy] - b[orderBy])
	);

	render() {
		const sortedData = this.sortData(this.props.data, 'name');

		let rows = [];
		for (let i = 0; i < sortedData.length; i++) {
			let el = sortedData[i];
			rows.push(
				<tr key={el.name}>
					<StyledName>
						{el.name}
						<div className="tooltip">{el.name}</div>
					</StyledName>
					<td>{el.fructose}</td>
					<td>{el.sucrose}</td>
					<td>{el.glucose}</td>
				</tr>
			);
		}

		return (
			<table
				style={{tableLayout: 'fixed', width: '100%', marginBottom: '4vmin'}}
			>
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
