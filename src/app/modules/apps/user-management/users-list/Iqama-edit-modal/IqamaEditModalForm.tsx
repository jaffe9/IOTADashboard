import {FC, useState} from 'react'
import * as Yup from 'yup'
import {useFormik} from 'formik'
import {isNotEmpty, toAbsoluteUrl} from '../../../../../../_metronic/helpers'
import {initialUser, National_id, payslipOptions, User} from '../core/_models'
import clsx from 'clsx'
import {UsersListLoading} from '../components/loading/UsersListLoading'
import {createUser, updateUser} from '../core/_requests'
import {useQueryResponse} from '../core/QueryResponseProvider'
import { useIqamaListView } from '../core/IqamaListViewProvider'


type Props = {
  isUserLoading: boolean
  payslipOption: payslipOptions
  user: User
  iqama:National_id
  national_id : number
  expiry_date : string
  associated_user_id:{username:string,email:string}
  payslipOptions:payslipOptions
}
let selectedPayslipOption = ""

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



const UserEditModalFormIqama: FC<Props> = ({user, iqama , isUserLoading, associated_user_id,national_id,expiry_date  }) => {
const {setItemIqamaForUpdate} = useIqamaListView()
const {refetch} = useQueryResponse()
let [userForEdit] = useState<User & National_id>({
    ...user,...iqama ,
    id: user.id || initialUser.id,
    pic: user.pic || initialUser.pic,
    occupation: user.occupation || initialUser.occupation,
    firstName: user.firstName || initialUser.firstName,
    lastName: user.lastName || initialUser.lastName,
    email: user.email || initialUser.email,
    national_id:  national_id.toString(),
    expiry_date: expiry_date.toString(),
    username:associated_user_id.username.toString(),
  
    
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
      setItemIqamaForUpdate(undefined)
    }

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
              value = {selectedUser.associated_user_id?.username}
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
              value = {selectedUser.associated_user_id?.email}
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
            <label className='disabled fw-bold fs-6 mb-2'>Iqama Number</label>
            {/* end::Label */}

            {/* begin::Input */}
            <input
              placeholder='Iqama Number'
              {...formik.getFieldProps('string')}
              className={clsx(
                'form-control form-control-solid mb-3 mb-lg-0',
                {'is-invalid': formik.touched.national_id && formik.errors.national_id},
                {
                  'is-valid': formik.touched.national_id && !formik.errors.national_id,
                }
              )}
              type='string'
              name='National Id'
              autoComplete='off'
              disabled={formik.isSubmitting || isUserLoading}
              value={national_id}
            />
            {/* end::Input */}
            {formik.touched.national_id && formik.errors.national_id && (
              <div className='fv-plugins-message-container'>
                <span role='alert'>{formik.errors.national_id}</span>
              </div>
            )}
          </div>
          {/* end::Input group */}

          {/* End of Basic Salary Information*/}

          {/* Begin Expiry Date Information*/}

          {/* begin::Input group */}
          <div className='fv-row mb-7'>
            {/* begin::Label */}
            <label className='disabled fw-bold fs-6 mb-2'>Expiry Date</label>
            {/* end::Label */}

            {/* begin::Input */}
            <input
              placeholder='Expiry Date'
              {...formik.getFieldProps('expiry_date')}
              className={clsx(
                'form-control form-control-solid mb-3 mb-lg-0',
                {'is-invalid': formik.touched.expiry_date && formik.errors.expiry_date},
                {
                  'is-valid': formik.touched.expiry_date && !formik.errors.expiry_date,
                }
              )}
              type='string'
              name='Expiry Date'
              autoComplete='off'
              disabled={formik.isSubmitting || isUserLoading}
              value={expiry_date}
            />
            {/* end::Input */}
            {formik.touched.expiry_date && formik.errors.expiry_date && (
              <div className='fv-plugins-message-container'>
                <span role='alert'>{formik.errors.expiry_date}</span>
              </div>
            )}
          </div>
          {/* end::Input group */}

          {/* End of Expiry Date Information*/}
             

          {/* begin::Input group */}

          <div className='mb-7'>
            {/* begin::Label }
            <label className='required fw-bold fs-6 mb-5'>For the month</label>
            <div className='text-gray-600'>
                    {payslipMonth}
                  </div>
                  <br></br><br></br>
            {/* end::Label }
            {/* begin::Roles }
            {/* begin::Input row }
            <div className='d-flex fv-row'>
              {/* begin::Radio }
              <div className='form-check form-check-custom form-check-solid'>
                {/* begin::Input }
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

                {/* end::Input }
                {/* begin::Label }
                <label className='form-check-label' htmlFor='kt_modal_update_role_option_0'>
                  <div className='fw-bolder text-gray-800'>Download</div>
                  <div className='text-gray-600'>
                    Generated and downloaded without sending an email to employee
                  </div>
                </label>
                {/* end::Label }
              </div>
              {/* end::Radio }
            </div>
            {/* end::Input row }
            <div className='separator separator-dashed my-5'></div>
            {/* begin::Input row }
            <div className='d-flex fv-row'>
              {/* begin::Radio }
              <div className='form-check form-check-custom form-check-solid'>
                {/* begin::Input }
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
                {/* end::Input }
                {/* begin::Label }
                <label className='form-check-label' htmlFor='kt_modal_update_role_option_1'>
                  <div className='fw-bolder text-gray-800'>Generate and eMail</div>
                  <div className='text-gray-600'>
                  Generated and sent as an email to employee
                  </div>
                </label>
                {/* end::Label }
              </div>
              {/* end::Radio }
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

export {UserEditModalFormIqama}
