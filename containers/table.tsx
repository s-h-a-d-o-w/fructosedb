import React from 'react';
import styled from 'styled-components';
import memoize from 'memoize-one';

const StyledTable = styled.table`
	table-layout: fixed;
	width: 100%;
	margin-bottom: 4vmin;

	background-color: mediumpurple;

	th {
		cursor: pointer;
	}

	th:first-child {
		text-align: left;
	}
`;

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
	state = {
		sortBy: 'name',
		sortAsc: true,
	};

	changeSorting(sortBy) {
		this.setState({
			sortBy,
			sortAsc: this.state.sortBy === sortBy ? !this.state.sortAsc : true,
		});
	}

	sortData = memoize(
		(sortBy, sortAsc) =>
			sortBy === 'name'
				? this.props.data.sort(
						(a, b) =>
							sortAsc
								? a[sortBy].localeCompare(b[sortBy])
								: b[sortBy].localeCompare(a[sortBy])
				  )
				: this.props.data.sort(
						(a, b) => (sortAsc ? a[sortBy] - b[sortBy] : b[sortBy] - a[sortBy])
				  )
	);

	render() {
		const sortedData = this.sortData(this.state.sortBy, this.state.sortAsc);

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
			<StyledTable>
				<thead>
					<tr>
						<th onClick={this.changeSorting.bind(this, 'name')}>Name</th>
						<th onClick={this.changeSorting.bind(this, 'fructose')}>
							Fructose (per 100g)
						</th>
						<th onClick={this.changeSorting.bind(this, 'sucrose')}>
							Sucrose (per 100g)
						</th>
						<th onClick={this.changeSorting.bind(this, 'glucose')}>
							Glucose (per 100g)
						</th>
					</tr>
				</thead>
				<tbody>{rows}</tbody>
			</StyledTable>
		);
	}
}
