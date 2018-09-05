import React from 'react';
import styled from 'styled-components';
import memoize from 'memoize-one';
import {connect} from 'react-redux';
import sort from 'fast-sort';

import {actions} from '../store/store.js';

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

	background-color: #d7c3eb;

	th {
		cursor: pointer;
		width: auto;
	}

	th:first-child {
		text-align: left;
		width: auto;
	}
`;

const StyledName: any = styled.td`
	@media all and (min-width: 45em) {
		text-overflow: ellipsis;
		overflow: hidden;
		white-space: nowrap;

		&:hover .tooltip {
			visibility: visible;
		}
	}

	text-align: left;

	.tooltip {
		background-color: aliceblue;

		position: absolute;
		margin: 0 0 0 2vmin;
		max-width: 50vw;
		white-space: normal;

		visibility: hidden;
	}
`;

const StyledHeader: any = styled.th`
	&::after {
		content: '${(props: any) =>
			props.sortAsc !== null ? (props.sortAsc ? ' ▲' : ' ▼') : ''}';
	}
`;

class Table extends React.Component<any, any> {
	state = {
		sortBy: 'ratio',
		sortAsc: false,
		headers: [
			{name: 'avoid', description: '🔒'},
			{name: 'name', description: 'Name'},
			{name: 'fructose', description: 'Fruct. per 100g'},
			{name: 'sucrose', description: 'Sucr. per 100g'},
			{name: 'glucose', description: 'Gluc. per 100g'},
			{name: 'ratio', description: 'F/G ratio'},
		],
	};

	changeSorting(sortBy, dispatch) {
		dispatch(
			actions.changeSort(
				sortBy,
				this.props.sortBy === sortBy ? !this.props.sortAsc : true
			)
		);
	}

	sortData = memoize((sortBy, sortAsc, lockedAvoid) => {
		return lockedAvoid
			? sort(this.props.data).by([
					{desc: 'avoid'},
					sortAsc ? {asc: sortBy} : {desc: sortBy},
			  ])
			: sort(this.props.data).by([sortAsc ? {asc: sortBy} : {desc: sortBy}]);
	});

	render() {
		const sortedData = this.sortData(
			this.props.sortBy,
			this.props.sortAsc,
			true
		);

		let rows = [];
		for (let i = 0; i < sortedData.length; i++) {
			let el = sortedData[i];
			rows.push(
				<tr key={el.name}>
					<td>
						{el.avoid ? (
							<div
								style={{width: '1rem', height: '1rem', backgroundColor: 'red'}}
							>
								&nbsp;
							</div>
						) : (
							<div
								style={{
									width: '1rem',
									height: '1rem',
									backgroundColor: 'green',
								}}
							>
								&nbsp;
							</div>
						)}
					</td>
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
						header.name === this.props.sortBy ? this.props.sortAsc : null
					}
					key={header.name}
					onClick={this.changeSorting.bind(
						this,
						header.name,
						this.props.dispatch
					)}
				>
					{header.description}
				</StyledHeader>
			);
		}

		return (
			<div style={{gridArea: 'table', padding: '1vmin 2vmin'}}>
				<StyledTable>
					<thead>
						<tr>{headers}</tr>
					</thead>
					<tbody>{rows}</tbody>
				</StyledTable>
			</div>
		);
	}
}

const mapStateToProps = (state) => ({
	sortBy: state.sortBy,
	sortAsc: state.sortAsc,
});

export default connect(mapStateToProps)(Table);
