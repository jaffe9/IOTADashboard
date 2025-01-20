import { right } from '@popperjs/core'
import {KTIcon} from '../../../../../../_metronic/helpers'
import {useListView} from '../core/ListViewProvider'
//
const UserEditModalHeader = () => {
  const {setItemIdForUpdate} = useListView()

  return (
    <div className='modal-header d-flex justify-content-between align-item-end'>
      {/* begin::Modal title */}
      <h2 className='fw-bolder'>Generate Payslip</h2>
      {/* end::Modal title */}

      {/* begin::Close */}
      <div
        className='btn btn-icon btn-sm btn-active-icon-primary btn-right'
        data-kt-users-modal-action='close'
        onClick={() => setItemIdForUpdate(undefined)}
        style={{cursor: 'pointer'}}
      >
        <KTIcon iconName='cross' className='fs-1 fw-bold'/>
      </div>
    
      {/* end::Close */}
    </div>
  )
}

export {UserEditModalHeader}
