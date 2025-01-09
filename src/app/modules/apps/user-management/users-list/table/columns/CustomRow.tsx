import clsx from 'clsx'
import {FC} from 'react'
import {Row} from 'react-table'
import {User} from '../../core/_models'

type Props = {
  row: Row<User>
}

const CustomRow: FC<Props> = ({ row }) => {
  // Extract the key and other row props
  const { key, ...rowProps } = row.getRowProps();

  return (
    <tr {...rowProps}>
      {row.cells.map((cell) => {
        // Extract the key and other cell props
        const { key: cellKey, ...cellProps } = cell.getCellProps();

        return (
          <td
            {...cellProps}
            key={cellKey} // Pass key explicitly to React
            className={clsx({ 'text-end min-w-100px': cell.column.id === 'actions' })}
          >
            {cell.render('Cell')}
          </td>
        );
      })}
    </tr>
  );
};

export {CustomRow}
