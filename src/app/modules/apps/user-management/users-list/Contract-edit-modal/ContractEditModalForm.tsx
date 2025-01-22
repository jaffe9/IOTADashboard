import {FC, useState} from 'react'
import * as Yup from 'yup'
import {useFormik} from 'formik'
import {isNotEmpty, toAbsoluteUrl} from '../../../../../../_metronic/helpers'
import {Contract, initialUser, payslipOptions, User} from '../core/_models'
import clsx from 'clsx'
import {useListView} from '../core/ListViewProvider'
import {UsersListLoading} from '../components/loading/UsersListLoading'
import {createUser, updateUser} from '../core/_requests'
import {useQueryResponse} from '../core/QueryResponseProvider'
//co
const date = new Date();
const payslipDate = date.toLocaleDateString('en-GB', {day: 'numeric', month: 'short', year: 'numeric'}).replace(/ /g, '-');
const payslipMonth = date.toLocaleDateString('en-GB', {month: 'short', year: 'numeric'}).replace(/ /g, '-');

type Props = {
  isUserLoading: boolean
  payslipOption: payslipOptions
  user: User
  contract_no: string
  contract_date: string
  contract_end_date: string
 
  payslipOptions:payslipOptions
}
const payslipOption = payslipOptions
let selectedPayslipOption = ""
function setPayslipOption(payslipOption: payslipOptions)
{
  if(payslipOptions.download === payslipOption)
    {
      selectedPayslipOption = payslipOptions.download
    }
    else
    {
      selectedPayslipOption = payslipOptions.email
    }
}

const editUserSchema = Yup.object().shape({
  email: Yup.string()
    .email('Wrong email format')
    .min(3, 'Minimum 3 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('Email is required'),
  name: Yup.string()
    .min(3, 'Minimum 3 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('Name is required'),
})



const UserEditModalFormContract: FC<Props> = ({user, contract_no, isUserLoading,contract_date,contract_end_date}) => {
const {setItemIdForUpdate} = useListView()
const {refetch} = useQueryResponse()
let [userForEdit] = useState<User & Contract> ({
    ...user,
    id: user.id || initialUser.id,
    pic: user.pic || initialUser.pic,
    occupation: user.occupation || initialUser.occupation,
    firstName: user.firstName || initialUser.firstName,
    lastName: user.lastName || initialUser.lastName,
    email: user.email || initialUser.email,
    contract_no: contract_no,
    contract_date: contract_date,
    contract_end_date: contract_end_date
  })
  const selectedUser = userForEdit
  const cancel = (withRefresh?: boolean) => 
    {
      alert("Cancelled")
      if (withRefresh) 
        {
          refetch()
          selectedPayslipOption = ""
        }
      setItemIdForUpdate(undefined)
    }

  const blankImg = toAbsoluteUrl('media/svg/avatars/blank.svg')
  const userAvatarImg = toAbsoluteUrl(`media/${userForEdit.pic}`)
  const formik = useFormik({
    initialValues: userForEdit,
    validationSchema: editUserSchema,
    onSubmit: async (values, {setSubmitting}) => {
      alert("Submitted")
      console.log("Submitted")
      setSubmitting(true)
      try {
        if (isNotEmpty(values.id)) {
          await updateUser(values)
        } else {
          await createUser(values)
        }
      } catch (ex) {
        console.error(ex)
      } finally {
        setSubmitting(true)
        cancel(true)
      }
    },
  })
  return (
    <>
      <form id='kt_modal_add_user_form' className='form' onSubmit={formik.handleSubmit} noValidate>
        {/* begin::Scroll */}
        <div
          className='d-flex flex-column scroll-y me-n7 pe-7'
          id='kt_modal_add_user_scroll'
          data-kt-scroll='true'
          data-kt-scroll-activate='{default: false, lg: true}'
          data-kt-scroll-max-height='auto'
          data-kt-scroll-dependencies='#kt_modal_add_user_header'
          data-kt-scroll-wrappers='#kt_modal_add_user_scroll'
          data-kt-scroll-offset='300px'
        >
          
          <div className='fv-row mb-7'>
            {/* begin::Label */}
            <label className='fw-bold fs-6 mb-2'>Full Name</label>
            {/* end::Label */}

            {/* begin::Input */}
            <input
              placeholder='Full name'
              {...formik.getFieldProps('firstName')}
              type='text'
              name='firstName'
              className={clsx(
                'form-control form-control-solid mb-3 mb-lg-0',
                {'is-invalid': formik.touched.firstName && formik.errors.firstName},
                {
                  'is-valid': formik.touched.firstName && !formik.errors.firstName,
                }
              )}
              autoComplete='off'
              disabled={formik.isSubmitting || isUserLoading}
              value = {selectedUser.firstName + " " + selectedUser.lastName}
            />
            {formik.touched.firstName && formik.errors.firstName && (
              <div className='fv-plugins-message-container'>
                <div className='fv-help-block'>
                  <span role='alert'>{formik.errors.firstName}</span>
                </div>
              </div>
            )}
            {/* end::Input */}
          </div>
          {/* end::Input group */}

          {/* begin::Input group */}
          <div className='fv-row mb-7'>
            {/* begin::Label */}
            <label className='disabled fw-bold fs-6 mb-2'>Email</label>
            {/* end::Label */}

            {/* begin::Input */}
            <input
              placeholder='Email'
              {...formik.getFieldProps('email')}
              className={clsx(
                'form-control form-control-solid mb-3 mb-lg-0',
                {'is-invalid': formik.touched.email && formik.errors.email},
                {
                  'is-valid': formik.touched.email && !formik.errors.email,
                }
              )}
              type='email'
              name='email'
              autoComplete='off'
              disabled={formik.isSubmitting || isUserLoading}
              value = {selectedUser.email}
            />
            {/* end::Input */}
            {formik.touched.email && formik.errors.email && (
              <div className='fv-plugins-message-container'>
                <span role='alert'>{formik.errors.email}</span>
              </div>
            )}
          </div>
          {/* end::Input group */}

          {/* Begin Basic Allowance Information*/}

          {/* begin::Input group */}
          <div className='fv-row mb-7'>
            {/* begin::Label */}
            <label className='disabled fw-bold fs-6 mb-2'>Contract Number</label>
            {/* end::Label */}

            {/* begin::Input */}
            <input
              placeholder='Contract Number'
              {...formik.getFieldProps('number')}
              className={clsx(
                'form-control form-control-solid mb-3 mb-lg-0',
                {'is-invalid': formik.touched.contract_no && formik.errors.contract_no},
                {
                  'is-valid': formik.touched.contract_no && !formik.errors.contract_no,
                }
              )}
              type='string'
              name='Basic Allowance'
              autoComplete='off'
              disabled={formik.isSubmitting || isUserLoading}
              value={contract_no}
            />
            {/* end::Input */}
            {formik.touched.contract_no && formik.errors.contract_no && (
              <div className='fv-plugins-message-container'>
                <span role='alert'>{formik.errors.contract_no}</span>
              </div>
            )}
          </div>
          {/* end::Input group */}

          {/* End of Basic Salary Information*/}

          {/* Begin Expiry Date Information*/}

          {/* begin::Input group */}
          <div className='fv-row mb-7'>
            {/* begin::Label */}
            <label className='disabled fw-bold fs-6 mb-2'>Contract Date</label>
            {/* end::Label */}

            {/* begin::Input */}
            <input
              placeholder='Contract Date'
              {...formik.getFieldProps('number')}
              className={clsx(
                'form-control form-control-solid mb-3 mb-lg-0',
                {'is-invalid': formik.touched.contract_date && formik.errors.contract_date},
                {
                  'is-valid': formik.touched.contract_date && !formik.errors.contract_date,
                }
              )}
              type='string'
              name='HRA'
              autoComplete='off'
              disabled={formik.isSubmitting || isUserLoading}
              value={contract_date}
            />
            {/* end::Input */}
            {formik.touched.contract_date && formik.errors.contract_date && (
              <div className='fv-plugins-message-container'>
                <span role='alert'>{formik.errors.contract_date}</span>
              </div>
            )}
          </div>
          {/* end::Input group */}

          {/* End of Expiry Date Information*/}

           {/* begin::Input group */}
           <div className='fv-row mb-7'>
            {/* begin::Label */}
            <label className='disabled fw-bold fs-6 mb-2'>Contract End Date</label>
            {/* end::Label */}

            {/* begin::Input */}
            <input
              placeholder='Contract end date'
              {...formik.getFieldProps('number')}
              className={clsx(
                'form-control form-control-solid mb-3 mb-lg-0',
                {'is-invalid': formik.touched.contract_end_date && formik.errors.contract_end_date},
                {
                  'is-valid': formik.touched.contract_end_date && !formik.errors.contract_end_date,
                }
              )}
              type='string'
              name='HRA'
              autoComplete='off'
              disabled={formik.isSubmitting || isUserLoading}
              value={contract_end_date}
            />
            {/* end::Input */}
            {formik.touched.contract_end_date && formik.errors.contract_end_date && (
              <div className='fv-plugins-message-container'>
                <span role='alert'>{formik.errors.contract_end_date}</span>
              </div>
            )}
          </div>
          {/* end::Input group */}

          {/* End of Expiry Date Information*/}
             

          {/* begin::Input group */}

          <div className='mb-7'>
            {/* begin::Label */}
            <label className='required fw-bold fs-6 mb-5'>For the month</label>
            <div className='text-gray-600'>
                    {payslipMonth}
                  </div>
                  <br></br><br></br>
            {/* end::Label */}
            {/* begin::Roles */}
            {/* begin::Input row */}
            <div className='d-flex fv-row'>
              {/* begin::Radio */}
              <div className='form-check form-check-custom form-check-solid'>
                {/* begin::Input */}
                <input
                  className='form-check-input me-3'
                  {...formik.getFieldProps('payslipOptions')}
                  name='download'
                  type='radio'
                //  defaultChecked={false}
                  value='Download'
                  id='kt_modal_update_role_option_0'
                  onClick={() =>setPayslipOption(payslipOptions.download)}
                  //onChange = {() => paySlipOptionOnChange("Download")}
                  checked={selectedPayslipOption === payslipOption.download}//{(formik.values.payslilpOptionSelected === payslipOptions.download)}
                  disabled={formik.isSubmitting || isUserLoading}
                />

                {/* end::Input */}
                {/* begin::Label */}
                <label className='form-check-label' htmlFor='kt_modal_update_role_option_0'>
                  <div className='fw-bolder text-gray-800'>Download</div>
                  <div className='text-gray-600'>
                    Generated and downloaded without sending an email to employee
                  </div>
                </label>
                {/* end::Label */}
              </div>
              {/* end::Radio */}
            </div>
            {/* end::Input row */}
            <div className='separator separator-dashed my-5'></div>
            {/* begin::Input row */}
            <div className='d-flex fv-row'>
              {/* begin::Radio */}
              <div className='form-check form-check-custom form-check-solid'>
                {/* begin::Input */}
                <input
                  className='form-check-input me-3'
                  {...formik.getFieldProps('payslipOptions')}
                  name='role'
                  type='radio'
               //   defaultChecked={false}
                  value='eMail'
                  id='kt_modal_update_role_option_1'
                  onClick={() =>setPayslipOption(payslipOptions.email)}
                  checked={selectedPayslipOption === payslipOptions.email}//{(formik.values.payslilpOptionSelected === payslipOptions.email)}
                  disabled={formik.isSubmitting || isUserLoading}
                />
                {/* end::Input */}
                {/* begin::Label */}
                <label className='form-check-label' htmlFor='kt_modal_update_role_option_1'>
                  <div className='fw-bolder text-gray-800'>Generate and eMail</div>
                  <div className='text-gray-600'>
                  Generated and sent as an email to employee
                  </div>
                </label>
                {/* end::Label */}
              </div>
              {/* end::Radio */}
            </div>
            {/* end::Roles */}
          </div>
          {/* end::Input group */}
        </div>
        {/* end::Scroll */}

        {/* begin::Actions */}
        <div className='text-center pt-15'>
          <button
            type='reset'
            onClick={() => cancel()}
            className='btn btn-light me-3'
            data-kt-users-modal-action='cancel'
            disabled={formik.isSubmitting || isUserLoading}
          >
            Discard
          </button>

          <button
            type='submit'
            className='btn btn-primary'
            data-kt-users-modal-action='submit'
            disabled={isUserLoading || formik.isSubmitting}
          >
            <span className='indicator-label'>Submit</span>
            {(formik.isSubmitting || isUserLoading) && (
              <span className='indicator-progress'>
                Please wait...{' '}
                <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
              </span>
            )}
          </button>
        </div>
        {/* end::Actions */}
      </form>
      {(formik.isSubmitting || isUserLoading) && <UsersListLoading />}
    </>
  )
}

export {UserEditModalFormContract}
