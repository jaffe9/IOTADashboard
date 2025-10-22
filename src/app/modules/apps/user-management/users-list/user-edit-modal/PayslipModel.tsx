import { useEffect } from 'react'
import { KTIcon } from '../../../../../../_metronic/helpers'
import { useListView } from '../core/ListViewProvider'
import { PayslipGenerator } from './PayslipGenerator'

const PayslipModal = () => {
  const { itemIdForUpdate, setItemIdForUpdate } = useListView()

  useEffect(() => {
    document.body.classList.add('modal-open')
    return () => {
      document.body.classList.remove('modal-open')
    }
  }, [])

  const handleClose = () => {
    setItemIdForUpdate(undefined)
  }

  if (!itemIdForUpdate) {
    return null
  }

    return (
    <>
<div className="modal fade show d-block" id="kt_modal_payslip" tabIndex={-1} role="dialog" aria-modal="true">
  <div
    className="modal-dialog modal-dialog-centered"
    style={{
      maxWidth: "700px", // reduced width
      width: "70%",
      maxHeight: "100vh", // reduced height
    }}
  >
    <div className="modal-content" style={{ maxHeight: "100vh", overflow: "hidden" }}>
      <div className="modal-header">
        <h2 className="fw-bolder">Generate Payslip</h2>
        <button
          type="button"
          className="btn btn-icon btn-sm btn-active-icon-primary"
          onClick={() => setItemIdForUpdate(undefined)}
        >
          <KTIcon iconName="cross" className="fs-1" />
        </button>
      </div>
      <div
        className="modal-body scroll-y mx-5 mx-xl-15 my-7"
        style={{ overflowY: "auto", maxHeight: "75vh" }} // scrollable content area
      >
        <PayslipGenerator employeeId={itemIdForUpdate.toString()} />
      </div>
    </div>
  </div>
</div>
<div className="modal-backdrop fade show" />

    </>
  )
}

export { PayslipModal }