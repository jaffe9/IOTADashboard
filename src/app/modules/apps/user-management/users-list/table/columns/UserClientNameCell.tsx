import {FC} from 'react'

type Props = {
  companyName?: string
}

const UserClientNameCell: FC<Props> = ({companyName}) => (
  <div className='badge badge-light-success fw-bolder '>{companyName}</div>
)

export {UserClientNameCell}
