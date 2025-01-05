import {FC, useState} from 'react'
import * as Yup from 'yup'
import {useFormik} from 'formik'
import {isNotEmpty, toAbsoluteUrl} from '../../../../../../_metronic/helpers'
import {initialUser, payslipOptions, Salary, User} from '../core/_models'
import clsx from 'clsx'
import {useListView} from '../core/ListViewProvider'
import {UsersListLoading} from '../components/loading/UsersListLoading'
import {createUser, updateUser} from '../core/_requests'
import {useQueryResponse} from '../core/QueryResponseProvider'

const date = new Date();
const payslipDate = date.toLocaleDateString('en-GB', {day: 'numeric', month: 'short', year: 'numeric'}).replace(/ /g, '-');
const payslipMonth = date.toLocaleDateString('en-GB', {month: 'short', year: 'numeric'}).replace(/ /g, '-');

type Props = {
  isUserLoading: boolean
  payslipOption: payslipOptions
  user: User
  salary: Salary
  basic_allowance: number
  hr_allowance: number
  travel_allowance: number
  lop_days : number
  salary_advance: number
  employee_request: number
  holidays: number
  lop_salary_total: number
  earnings_total: number
  deductions_total: number
  total_net_salary: number
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



const UserEditModalForm: FC<Props> = ({user, salary, isUserLoading, basic_allowance, hr_allowance, travel_allowance, lop_days, salary_advance, lop_salary_total, holidays, earnings_total, deductions_total, total_net_salary, employee_request}) => {
const {setItemIdForUpdate} = useListView()
const {refetch} = useQueryResponse()
let [userForEdit] = useState<User & Salary>({
    ...user, ...salary,
    id: user.id || initialUser.id,
    pic: user.pic || initialUser.pic,
    occupation: user.occupation || initialUser.occupation,
    firstName: user.firstName || initialUser.firstName,
    lastName: user.lastName || initialUser.lastName,
    email: user.email || initialUser.email,
    basic_allowance: basic_allowance.toString(),
    hr_allowance: hr_allowance.toString(),
    travel_other_allowance: travel_allowance.toString(),
    salary_advance: salary_advance.toString(),
    employee_request: employee_request.toString(),
    holidays: holidays.toString(),
    lop_salary_total: lop_salary_total.toString(),
    earnings_total: earnings_total.toString(),
    deductions_total: deductions_total.toString(),
    total_net_salary: total_net_salary.toString(),
    payslilpOptionSelected: salary.payslilpOptionSelected
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
            <label className='disabled fw-bold fs-6 mb-2'>Basic Allowance</label>
            {/* end::Label */}

            {/* begin::Input */}
            <input
              placeholder='Basic Allowance'
              {...formik.getFieldProps('number')}
              className={clsx(
                'form-control form-control-solid mb-3 mb-lg-0',
                {'is-invalid': formik.touched.basic_allowance && formik.errors.basic_allowance},
                {
                  'is-valid': formik.touched.basic_allowance && !formik.errors.basic_allowance,
                }
              )}
              type='string'
              name='Basic Allowance'
              autoComplete='off'
              disabled={formik.isSubmitting || isUserLoading}
              value={basic_allowance}
            />
            {/* end::Input */}
            {formik.touched.basic_allowance && formik.errors.basic_allowance && (
              <div className='fv-plugins-message-container'>
                <span role='alert'>{formik.errors.basic_allowance}</span>
              </div>
            )}
          </div>
          {/* end::Input group */}

          {/* End of Basic Salary Information*/}

          {/* Begin HRA Information*/}

          {/* begin::Input group */}
          <div className='fv-row mb-7'>
            {/* begin::Label */}
            <label className='disabled fw-bold fs-6 mb-2'>House Rent Allowance</label>
            {/* end::Label */}

            {/* begin::Input */}
            <input
              placeholder='House Rent Allowance'
              {...formik.getFieldProps('number')}
              className={clsx(
                'form-control form-control-solid mb-3 mb-lg-0',
                {'is-invalid': formik.touched.hr_allowance && formik.errors.hr_allowance},
                {
                  'is-valid': formik.touched.hr_allowance && !formik.errors.hr_allowance,
                }
              )}
              type='string'
              name='HRA'
              autoComplete='off'
              disabled={formik.isSubmitting || isUserLoading}
              value={hr_allowance}
            />
            {/* end::Input */}
            {formik.touched.hr_allowance && formik.errors.hr_allowance && (
              <div className='fv-plugins-message-container'>
                <span role='alert'>{formik.errors.hr_allowance}</span>
              </div>
            )}
          </div>
          {/* end::Input group */}

          {/* End of HR Information*/}

          {/* Begin Travel Allowance Information*/}

          {/* begin::Input group */}
          <div className='fv-row mb-7'>
            {/* begin::Label */}
            <label className='disabled fw-bold fs-6 mb-2'>Travel & Other Allowance</label>
            {/* end::Label */}

            {/* begin::Input */}
            <input
              placeholder='Travel & Other Allowance'
              {...formik.getFieldProps('number')}
              className={clsx(
                'form-control form-control-solid mb-3 mb-lg-0',
                {'is-invalid': formik.touched.travel_other_allowance && formik.errors.travel_other_allowance},
                {
                  'is-valid': formik.touched.travel_other_allowance && !formik.errors.travel_other_allowance,
                }
              )}
              type='string'
              name='HRA'
              autoComplete='off'
              disabled={formik.isSubmitting || isUserLoading}
              value={travel_allowance}
            />
            {/* end::Input */}
            {formik.touched.travel_other_allowance && formik.errors.travel_other_allowance && (
              <div className='fv-plugins-message-container'>
                <span role='alert'>{formik.errors.travel_other_allowance}</span>
              </div>
            )}
          </div>
          {/* end::Input group */}

          {/* End of Travel Allownace Information*/}

          {/* Begin LOP Days Information*/}

          {/* begin::Input group */}
          <div className='fv-row mb-7'>
            {/* begin::Label */}
            <label className='disabled fw-bold fs-6 mb-2'>LOP Days</label>
            {/* end::Label */}

            {/* begin::Input */}
            <input
              placeholder='LOP Days'
              {...formik.getFieldProps('number')}
              className={clsx(
                'form-control form-control-solid mb-3 mb-lg-0',
                {'is-invalid': formik.touched.lop_days && formik.errors.lop_days},
                {
                  'is-valid': formik.touched.lop_days && !formik.errors.lop_days,
                }
              )}
              type='string'
              name='HRA'
              autoComplete='off'
              disabled={formik.isSubmitting || isUserLoading}
              value={lop_days}
            />
            {/* end::Input */}
            {formik.touched.lop_days && formik.errors.lop_days && (
              <div className='fv-plugins-message-container'>
                <span role='alert'>{formik.errors.lop_days}</span>
              </div>
            )}
          </div>
          {/* end::Input group */}

          {/* End of LOP Days Information*/}

          {/* Begin Salary Advance Information*/}

          {/* begin::Input group */}
          <div className='fv-row mb-7'>
            {/* begin::Label */}
            <label className='disabled fw-bold fs-6 mb-2'>Salary Advance</label>
            {/* end::Label */}

            {/* begin::Input */}
            <input
              placeholder='Salary Advance'
              {...formik.getFieldProps('number')}
              className={clsx(
                'form-control form-control-solid mb-3 mb-lg-0',
                {'is-invalid': formik.touched.salary_advance && formik.errors.salary_advance},
                {
                  'is-valid': formik.touched.salary_advance && !formik.errors.salary_advance,
                }
              )}
              type='string'
              name='SA'
              autoComplete='off'
              disabled={formik.isSubmitting || isUserLoading}
              value={salary_advance}
            />
            {/* end::Input */}
            {formik.touched.salary_advance && formik.errors.salary_advance && (
              <div className='fv-plugins-message-container'>
                <span role='alert'>{formik.errors.salary_advance}</span>
              </div>
            )}
          </div>
          {/* end::Input group */}

          {/* End of Salary Advance Information*/}

          {/* Begin Employee Request Information*/}

          {/* begin::Input group */}
          <div className='fv-row mb-7'>
            {/* begin::Label */}
            <label className='disabled fw-bold fs-6 mb-2'>Employee Request</label>
            {/* end::Label */}

            {/* begin::Input */}
            <input
              placeholder='Employee Request'
              {...formik.getFieldProps('number')}
              className={clsx(
                'form-control form-control-solid mb-3 mb-lg-0',
                {'is-invalid': formik.touched.employee_request && formik.errors.employee_request},
                {
                  'is-valid': formik.touched.employee_request && !formik.errors.employee_request,
                }
              )}
              type='string'
              name='HRA'
              autoComplete='off'
              disabled={formik.isSubmitting || isUserLoading}
              value={employee_request}
            />
            {/* end::Input */}
            {formik.touched.employee_request && formik.errors.employee_request && (
              <div className='fv-plugins-message-container'>
                <span role='alert'>{formik.errors.employee_request}</span>
              </div>
            )}
          </div>
          {/* end::Input group */}

          {/* End of Employee Request Information*/}

          {/* Begin Holidays Information*/}

          {/* begin::Input group */}
          <div className='fv-row mb-7'>
            {/* begin::Label */}
            <label className='disabled fw-bold fs-6 mb-2'>Holidays</label>
            {/* end::Label */}

            {/* begin::Input */}
            <input
              placeholder='Holidays'
              {...formik.getFieldProps('number')}
              className={clsx(
                'form-control form-control-solid mb-3 mb-lg-0',
                {'is-invalid': formik.touched.holidays && formik.errors.holidays},
                {
                  'is-valid': formik.touched.holidays && !formik.errors.holidays,
                }
              )}
              type='string'
              name='HRA'
              autoComplete='off'
              disabled={formik.isSubmitting || isUserLoading}
              value={holidays}
            />
            {/* end::Input */}
            {formik.touched.holidays && formik.errors.holidays && (
              <div className='fv-plugins-message-container'>
                <span role='alert'>{formik.errors.holidays}</span>
              </div>
            )}
          </div>
          {/* end::Input group */}

          {/* End of Holidays Information*/}

          {/* Begin LOP Salary Total Information*/}

          {/* begin::Input group */}
          <div className='fv-row mb-7'>
            {/* begin::Label */}
            <label className='disabled fw-bold fs-6 mb-2'>LOP Salary Total</label>
            {/* end::Label */}

            {/* begin::Input */}
            <input
              placeholder='LOP Salary Total'
              {...formik.getFieldProps('number')}
              className={clsx(
                'form-control form-control-solid mb-3 mb-lg-0',
                {'is-invalid': formik.touched.lop_salary_total && formik.errors.lop_salary_total},
                {
                  'is-valid': formik.touched.lop_salary_total && !formik.errors.lop_salary_total,
                }
              )}
              type='string'
              name='HRA'
              autoComplete='off'
              disabled={formik.isSubmitting || isUserLoading}
              value={lop_salary_total}
            />
            {/* end::Input */}
            {formik.touched.lop_salary_total && formik.errors.lop_salary_total && (
              <div className='fv-plugins-message-container'>
                <span role='alert'>{formik.errors.lop_salary_total}</span>
              </div>
            )}
          </div>
          {/* end::Input group */}

          {/* End of LOP Salary Total Information*/}

          {/* Begin Earnings Total Information*/}

          {/* begin::Input group */}
          <div className='fv-row mb-7'>
            {/* begin::Label */}
            <label className='disabled fw-bold fs-6 mb-2'>Earnigns Total</label>
            {/* end::Label */}

            {/* begin::Input */}
            <input
              placeholder='Earnings Total'
              {...formik.getFieldProps('number')}
              className={clsx(
                'form-control form-control-solid mb-3 mb-lg-0',
                {'is-invalid': formik.touched.earnings_total && formik.errors.earnings_total},
                {
                  'is-valid': formik.touched.earnings_total && !formik.errors.earnings_total,
                }
              )}
              type='string'
              name='HRA'
              autoComplete='off'
              disabled={formik.isSubmitting || isUserLoading}
              value={earnings_total}
            />
            {/* end::Input */}
            {formik.touched.earnings_total && formik.errors.earnings_total && (
              <div className='fv-plugins-message-container'>
                <span role='alert'>{formik.errors.earnings_total}</span>
              </div>
            )}
          </div>
          {/* end::Input group */}

          {/* End of Earnings Total Information*/}

          {/* Begin Deductions Total Information*/}

          {/* begin::Input group */}
          <div className='fv-row mb-7'>
            {/* begin::Label */}
            <label className='disabled fw-bold fs-6 mb-2'>Deductions Total</label>
            {/* end::Label */}

            {/* begin::Input */}
            <input
              placeholder='Deductions Total'
              {...formik.getFieldProps('number')}
              className={clsx(
                'form-control form-control-solid mb-3 mb-lg-0',
                {'is-invalid': formik.touched.deductions_total && formik.errors.deductions_total},
                {
                  'is-valid': formik.touched.deductions_total && !formik.errors.deductions_total,
                }
              )}
              type='string'
              name='HRA'
              autoComplete='off'
              disabled={formik.isSubmitting || isUserLoading}
              value={deductions_total}
            />
            {/* end::Input */}
            {formik.touched.deductions_total && formik.errors.deductions_total && (
              <div className='fv-plugins-message-container'>
                <span role='alert'>{formik.errors.deductions_total}</span>
              </div>
            )}
          </div>
          {/* end::Input group */}

          {/* End of Deductions Total Information*/}
          
          {/* Begin Total Net Salary Information*/}

          {/* begin::Input group */}
          <div className='fv-row mb-7'>
            {/* begin::Label */}
            <label className='disabled fw-bold fs-6 mb-2'>Total Net Salary</label>
            {/* end::Label */}

            {/* begin::Input */}
            <input
              placeholder='Total Net Salary'
              {...formik.getFieldProps('number')}
              className={clsx(
                'form-control form-control-solid mb-3 mb-lg-0',
                {'is-invalid': formik.touched.total_net_salary && formik.errors.total_net_salary},
                {
                  'is-valid': formik.touched.total_net_salary && !formik.errors.total_net_salary,
                }
              )}
              type='string'
              name='HRA'
              autoComplete='off'
              disabled={formik.isSubmitting || isUserLoading}
              value={total_net_salary}
            />
            {/* end::Input */}
            {formik.touched.total_net_salary && formik.errors.total_net_salary && (
              <div className='fv-plugins-message-container'>
                <span role='alert'>{formik.errors.total_net_salary}</span>
              </div>
            )}
          </div>
          {/* end::Input group */}

          {/* End of Total Net Salary Information*/}

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
                  defaultChecked={false}
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
                  defaultChecked={false}
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

export {UserEditModalForm}
