import * as React from 'react';
import {IntlShape} from 'react-intl';
import {Column, SortDirection, TableCellRenderer} from 'react-virtualized';
import toPX from 'to-px';

import * as Icons from 'components/Icons';

import * as Data from './data';
import {Props as TableProps} from './FoodsTable';

const renderAvoid: TableCellRenderer = ({cellData}) =>
	cellData ? Icons.error : Icons.ok;

export const renderColumns = ({
	dispatchHideFloat,
	dispatchShowFloat,
	intl,
	showServingSize,
}: Pick<
	TableProps,
	'dispatchHideFloat' | 'dispatchShowFloat' | 'showServingSize'
> & {intl: IntlShape}) => {
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
			dataKey={column.name}
			defaultSortDirection={
				column.name === 'name' ? SortDirection.ASC : SortDirection.DESC
			}
			flexGrow={column.name === 'name' ? 1 : 0}
			key={column.name}
			label={
				column.name === 'avoid' ? '' : intl.formatMessage({id: column.name})
			}
			width={column.remWidth * toPX('rem')}
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
			{...(column.name === 'measure'
				? {
						cellRenderer: renderMeasure.bind(null, intl),
				  }
				: {})}
		/>
	));
};

const renderMeasure = (intl: IntlShape, {cellData}: {cellData?: string}) => {
	if (intl.locale !== 'en' && cellData) {
		const chunks = cellData.split(' ');
		chunks[1] = intl.formatMessage({
			id: chunks[1],
			defaultMessage: intl.formatMessage({id: 'unit(s)'}),
			// defaultMessage: chunks[1],
		});
		return chunks.join(' ');
	} else {
		return cellData;
	}
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
