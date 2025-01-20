import { right } from '@popperjs/core'
import {KTIcon} from '../../../../../../_metronic/helpers'

import { useContractListView } from '../core/ContractListViewProvider'
//
const UserEditModalHeaderContract = () => {
  const {setItemContractForUpdate} = useContractListView()

  return (
    <div className='modal-header d-flex justify-content-between align-items-end'>
      {/* begin::Modal title */}
      <h2 className='fw-bolder'>Contract Update</h2>
      {/* end::Modal title */}

      {/* begin::Close */}
      <div
        className='btn btn-icon btn-sm btn-active-icon-primary'
        data-kt-users-modal-action='close'
        onClick={() => setItemContractForUpdate(undefined)}
        style={{cursor: 'pointer'}}
      >
        <KTIcon iconName='cross' className='fs-1 fw-bold'/>
      </div>
      {/* end::Close */}
    </div>
  )
}

export {UserEditModalHeaderContract}
