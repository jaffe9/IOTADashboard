import {Column} from 'react-table'
import {UserInfoCell} from './UserInfoCell'
import {UserClientNameCell} from './UserClientNameCell'
import {UserEmployeeIdCell} from './UserEmployeeIdCell'
import {UserActionsCell} from './UserActionsCell'
import {UserSelectionCell} from './UserSelectionCell'
import {UserCustomHeader} from './UserCustomHeader'
import {UserSelectionHeader} from './UserSelectionHeader'
import {User} from '../../core/_models'

const usersColumns: ReadonlyArray<Column<User>> = [
  {
    Header: (props) => <UserSelectionHeader tableProps={props} />,
    id: 'id',
    Cell: ({...props}) => <UserSelectionCell id={props.data[props.row.index].id} />,
  },
  {
    Header: (props) => <UserCustomHeader tableProps={props} title='Full Name' className='min-w-125px' />,
    id: 'firstName',
    Cell: ({...props}) => <UserInfoCell user={props.data[props.row.index]} />,
  },
  {
    Header: (props) => <UserCustomHeader tableProps={props} title='Role' className='min-w-125px' />,
    accessor: 'occupation',
  },
  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='Client Name' className='min-w-125px' />
    ),
    id: 'companyName',
    Cell: ({...props}) => <UserClientNameCell companyName={props.data[props.row.index].companyName} />,
  },
  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='Employee Id' className='min-w-125px' />
    ),
    id: 'employeeId',
    Cell: ({...props}) => <UserEmployeeIdCell employee_id={props.data[props.row.index].employeeId} />,
  },
  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='Joined day' className='min-w-125px' />
    ),
    accessor: 'employeeJoiningDate',
  },
  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='Actions' className='text-end min-w-100px' />
    ),
    id: 'actions',
    Cell: ({...props}) => <UserActionsCell id={props.data[props.row.index].id} iqama={props.data[props.row.index].id} contract={props.data[props.row.index].id}  />,
  },
]

export {usersColumns}
