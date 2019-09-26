import * as React from 'react';
import {Column, SortDirection, TableCellRenderer} from 'react-virtualized';
import toPX from 'to-px';

import * as Icons from 'components/Icons';

import * as Data from './data';
import {Props as TableProps} from './Table';

const renderAvoid: TableCellRenderer = ({cellData}) =>
	cellData ? Icons.error : Icons.ok;

export const renderColumns = ({
	dispatchHideFloat,
	dispatchShowFloat,
	showServingSize,
}: Pick<
	TableProps,
	'dispatchHideFloat' | 'dispatchShowFloat' | 'showServingSize'
>) => {
	const headers = showServingSize
		? Data.generateHeaders([
				'avoid',
				'name',
				'measure',
				'fructoseServing',
				'sucroseServing',
				'glucoseServing',
				'ratio',
		  ])
		: Data.generateHeaders([
				'avoid',
				'name',
				'fructose',
				'sucrose',
				'glucose',
				'ratio',
		  ]);

	return headers.map((column) => (
		<Column
			key={column.name}
			dataKey={column.name}
			defaultSortDirection={
				column.name === 'name' ? SortDirection.ASC : SortDirection.DESC
			}
			label={column.description}
			width={column.remWidth * toPX('rem')}
			flexGrow={column.name === 'name' ? 1 : 0}
			{...(column.name === 'avoid' ? {cellRenderer: renderAvoid} : {})}
			{...(column.name === 'name'
				? {
						cellRenderer: renderName.bind(
							null,
							dispatchHideFloat,
							dispatchShowFloat
						),
				  }
				: {})}
		/>
	));
};

const renderName = (
	dispatchHideFloat: TableProps['dispatchHideFloat'],
	dispatchShowFloat: TableProps['dispatchShowFloat'],
	{cellData}: {cellData?: string}
) => (
	<div
		onClick={dispatchShowFloat.bind(null, cellData || '')}
		onMouseOver={dispatchShowFloat.bind(null, cellData || '')}
		onMouseLeave={dispatchHideFloat}
	>
		{cellData}
	</div>
);
