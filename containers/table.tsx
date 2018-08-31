import React from 'react';
import styled from 'styled-components';
import memoize from 'memoize-one';

/*
// See: https://github.com/styled-components/styled-components/issues/630#issuecomment-411542050
const component: <Props>(
	Tag: string
) => React.SFC<Props & {className?: string}> = (Tag) => (props) => (
	<Tag className={props.className}>{props.children}</Tag>
);

interface ITableHeader {
	sortAsc: boolean;
	onClick: any;
}
*/

const StyledTable = styled.table`
	color: black;

	table-layout: fixed;
	width: 100%;
	margin-bottom: 4vmin;

	background-color: mediumpurple;

	th {
		cursor: pointer;
	}

	th:first-child {
		text-align: left;
		width: 55%;
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

const StyledHeader: any = styled.th`
	&::after {
		content: '${(props: any) =>
			props.sortAsc !== null ? (props.sortAsc ? ' ^' : ' v') : ''}';
	}
`;

export class Table extends React.Component<any, any> {
	state = {
		sortBy: 'name',
		sortAsc: true,
		headers: [
			{name: 'name', description: 'Name'},
			{name: 'fructose', description: 'Fructose per 100g'},
			{name: 'sucrose', description: 'Sucrose per 100g'},
			{name: 'glucose', description: 'Glucose per 100g'},
			{name: 'ratio', description: 'F/C ratio'},
		],
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
					<td>{el.ratio}</td>
				</tr>
			);
		}

		let headers = [];
		for (let header of this.state.headers) {
			headers.push(
				<StyledHeader
					sortAsc={
						header.name === this.state.sortBy ? this.state.sortAsc : null
					}
					key={header.name}
					onClick={this.changeSorting.bind(this, header.name)}
				>
					{header.description}
				</StyledHeader>
			);
		}

		return (
			<div style={{flexGrow: 1}}>
				<StyledTable {...this.state}>
					<thead>
						<tr>{headers}</tr>
					</thead>
					<tbody>{rows}</tbody>
				</StyledTable>
			</div>
		);
	}
}
