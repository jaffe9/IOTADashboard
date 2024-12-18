import {FC} from 'react'

type Props = {
  employee_id?: string
}

const UserEmployeeIdCell: FC<Props> = ({employee_id}) => (
  <div className='badge badge-light fw-bolder'>{employee_id}</div>
)

export {UserEmployeeIdCell}