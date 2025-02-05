import {FC, useState} from 'react'
import * as Yup from 'yup'
import {useFormik} from 'formik'
import Flatpickr from "react-flatpickr";
import {Contract, initialUser, User} from '../core/_models'
import clsx from 'clsx'
import {UsersListLoading} from '../components/loading/UsersListLoading'
import {createUser, getEmpForContractInForm, UpdateContractExp, updateUser} from '../core/_requests'
import {useQueryResponse} from '../core/QueryResponseProvider'
import {  IProfileDetailsContractForAction, profileDetailsInitValuesContractForAction as initialValues} from '../../../../accounts/components/settings/SettingsModel'
import { useContractListView } from '../core/ContractListViewProvider';


var allUserInfo:any = await getEmpForContractInForm().then(async (data) =>  {
  return data.data;
});

type Props = {
  isUserLoading: boolean
  user: User
  contract:Contract
  contract_no: string
  contract_date: string
  contract_end_date: string
  billing_months : number
  billing_value : number
  client_id : { client_name : string }
  associatedAccountManager : { accountManagerName : string }
  associated_user_id : { username: string , email : string }
  
}

let  updatedUserInfo : IProfileDetailsContractForAction = initialValues;

const UserEditModalFormContract: FC<Props> = ({user, contract,contract_no, isUserLoading,contract_date,contract_end_date, billing_months, billing_value ,client_id , associated_user_id , associatedAccountManager}) => {
const {setItemContractForUpdate} = useContractListView()
const {refetch} = useQueryResponse()
const [ data , setData ] = useState<IProfileDetailsContractForAction>(updatedUserInfo)
const updateData = (fieldsToUpdate: Partial<IProfileDetailsContractForAction>): void => {
    const updatedData = Object.assign(updatedUserInfo, fieldsToUpdate);
    setData(updatedData);
  };
const handleUserChange = async (id: number) => {
  const hasMatch = allUserInfo.find((value: Contract) => value.id === id);
  if (!hasMatch) return;

  if (hasMatch.associated_user_id.username !== selectedUser.associated_user_id.username) {
    alert("Selected employee name does not match the displayed Employee Name field.");
  }
    updateData({
       id : id,
       contract_date: hasMatch.contract_data,
       contract_end_date : hasMatch.contract_end_date,
       contract_no : hasMatch.contract_no,
    });
  };
  
const hiddenIds = [10,11];

let [userForEdit] = useState<User & Contract> ({
    ...user,...contract,
    id: user.id || initialUser.id,
    pic: user.pic || initialUser.pic,
    occupation: user.occupation || initialUser.occupation,
    firstName: user.firstName || initialUser.firstName,
    lastName: user.lastName || initialUser.lastName,
    email: user.email || initialUser.email,
    contract_no: contract_no,
    contract_date: contract_date,
    contract_end_date: contract_end_date,
    billing_months : billing_months,
    
    companyName : client_id.client_name,
    
    accountManagerName : associatedAccountManager.accountManagerName,
  })

  const selectedUser = userForEdit
  const cancel = (withRefresh?: boolean) => 
    {
     // alert("Cancelled")
      if (withRefresh) 
        {
          refetch()
          
        }
      setItemContractForUpdate(undefined)
    }
    const [loading, setLoading] = useState(false);
    const formik = useFormik<IProfileDetailsContractForAction>({
      initialValues,
      onSubmit:async () => {
        setLoading(true);
        setTimeout(async () => {
          const updatedData = Object.assign(data, updatedUserInfo);
          setData(updatedData);
          if( !data.id)
          {
            alert("Please Select Employee From Select Field")
            setLoading(false)
            return
          }
          const contract : Contract = {
           id:data.id,
           contract_date:data.contract_date,
           contract_end_date:data.contract_end_date,
           contract_no:data.contract_no,
            };
      
                  console.log("updated Contract e:" , contract)
                  const apiResponse = await UpdateContractExp(contract)
                
                  if (apiResponse.status === 204)
                    {
                      alert("contract updated Successful");
                      setLoading(false);
                    }
                    else
                    {
                      alert("An error occurred, please try again later");
                      setLoading(false);
                    }
                }, 1000);
              },
            });
 
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
            <label className='fw-bold fs-6 mb-2'>Employee Name</label>
            {/* end::Label */}

            {/* begin::Input */}
            <input
              placeholder='Employee name'
              {...formik.getFieldProps('username')}
              type='text'
              name='User Name'
              className={clsx(
                'form-control form-control-solid mb-3 mb-lg-0',
                {'is-invalid': formik.touched.username && formik.errors.username},
                {
                  'is-valid': formik.touched.username && !formik.errors.username,
                }
              )}
              autoComplete='off'
              disabled={formik.isSubmitting || isUserLoading}
              value = {selectedUser.associated_user_id?.username}
            />
            {formik.touched.username && formik.errors.username && (
              <div className='fv-plugins-message-container'>
                <div className='fv-help-block'>
                  <span role='alert'>{formik.errors.username}</span>
                </div>
              </div>
            )}
            {/* end::Input */}
          </div>
          
          <div className='fv-row mb-7'>
            {/* begin::Label */}
            <label className='fw-bold fs-6 mb-2'>Employee Id</label>
            {/* end::Label */}

            {/* begin::Input */}
          
            <select
              id="id"
               className="form-select form-select-solid form-select-lg fw-bold required"
                 {...formik.getFieldProps("associated_user_id.username")}
                      
                onChange={async (value) => {
                 await  handleUserChange(parseInt(value.target.value));
                 formik.setFieldValue("associated_user_id.username",updatedUserInfo.id)
                   }}
                    //  value={initialValues.user_id}
                    > 
                      <option value="" >Select Employee </option>
                      {allUserInfo.map((data: any, i: number) => (
                        <option key={i} value={data.id} hidden={data.associated_user_id == null} >
                          {data.associated_user_id?.username}
                        </option>
                      ))}
                    </select>
        
            {/* end::Input */}
          </div>

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
                {'is-invalid': formik.touched.associated_user_id && formik.errors.associated_user_id},
                {
                  'is-valid': formik.touched.associated_user_id && !formik.errors.associated_user_id,
                }
              )}
              type='email'
              name='email'
              autoComplete='off'
              disabled={formik.isSubmitting || isUserLoading}
              value = {selectedUser.associated_user_id?.email}
            />
            {/* end::Input */}
            {formik.touched.associated_user_id && formik.errors.associated_user_id && (
              <div className='fv-plugins-message-container'>
                <span role='alert'></span>
              </div>
            )}
          </div>
      
          
        
          <div className='fv-row mb-7'>
          
            <label className='disabled fw-bold fs-6 mb-2'>Contract Number</label>
    
            <input
              placeholder='Contract Number'
              {...formik.getFieldProps('contract_no')}
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
    
            {formik.touched.contract_no && formik.errors.contract_no && (
              <div className='fv-plugins-message-container'>
                <span role='alert'>{formik.errors.contract_no}</span>
              </div>
            )}
          </div>

          <div className='fv-row mb-7'>
          
          <label className='disabled fw-bold fs-6 mb-2'>Update Contract Number</label>
  
          <input
            placeholder='Contract Number'
            {...formik.getFieldProps('contract_no')}
            className={clsx(
              'form-control form-control-solid mb-3 mb-lg-0',
              {'is-invalid': formik.touched.contract_no && formik.errors.contract_no},
              {
                'is-valid': formik.touched.contract_no && !formik.errors.contract_no,
              }
            )}
            type='string'
            name='Contract No'
            autoComplete='off'
            
            onChange={(value) => {
               updateData({ contract_no:value.target.value});
               formik.setFieldValue("contract_no",updatedUserInfo.contract_no)
            }
          }
          />
  
          {formik.touched.contract_no && formik.errors.contract_no && (
            <div className='fv-plugins-message-container'>
              <span role='alert'>{formik.errors.contract_no}</span>
            </div>
          )}
        </div>
      
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
          
            <div className='fv-row mb-7'>
                      {/* begin::Label */}
                      <label className='disabled fw-bold fs-6 mb-2'>Update Contract Date</label>
                      {/* end::Label */}
          
                      {/* begin::Input */}
                      <Flatpickr
                          className="form-control form-control-lg form-control-solid"
                          placeholder="Click To Select Date"
                          options={{
                          mode: "single",
                          dateFormat: "d-m-Y",
                           }}
                          onChange={(dateStr) => {
                           updateData({ contract_date: dateStr.toLocaleString("en",{
                           year: "numeric",
                           month: "2-digit",
                           day : "2-digit"
                            }).replace(/\//g, "-") });
                            }}
                           ></Flatpickr>        
                      {/* end::Input */}
                      {formik.touched.contract_date && formik.errors.contract_date && (
                        <div className='fv-plugins-message-container'>
                          <span role='alert'>{formik.errors.contract_date}</span>
                        </div>
                      )}
                    </div>

      

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
              name='Cotract End Date '
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
          
          <div className='fv-row mb-7'>
                      {/* begin::Label */}
                      <label className='disabled fw-bold fs-6 mb-2'>Update Contract End Date</label>
                      {/* end::Label */}
          
                      {/* begin::Input */}
                      <Flatpickr
                          className="form-control form-control-lg form-control-solid"
                          placeholder="Click To Select Date"
                          options={{
                          mode: "single",
                          dateFormat: "d-m-Y",
                           }}
                          onChange={(dateStr) => {
                           updateData({ contract_end_date: dateStr.toLocaleString("en",{
                           year: "numeric",
                           month: "2-digit",
                           day : "2-digit"
                            }).replace(/\//g, "-") });
                            }}
                           ></Flatpickr>        
                      {/* end::Input */}
                      {formik.touched.contract_end_date && formik.errors.contract_end_date && (
                        <div className='fv-plugins-message-container'>
                          <span role='alert'>{formik.errors.contract_end_date}</span>
                        </div>
                      )}
                    </div>

           <div className='fv-row mb-7'>
            {/* begin::Label */}
            <label className='disabled fw-bold fs-6 mb-2'>Billing Months</label>
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
              name='Billing Months '
              autoComplete='off'
              disabled={formik.isSubmitting || isUserLoading}
              value={billing_months}
            />
            {/* end::Input */}
            {formik.touched.contract_end_date && formik.errors.contract_end_date && (
              <div className='fv-plugins-message-container'>
                <span role='alert'>{formik.errors.contract_end_date}</span>
              </div>
            )}
          </div>
          {/* end::Input group */}

           {/* begin::Input group */}
           <div className='fv-row mb-7'>
            {/* begin::Label */}
            <label className='disabled fw-bold fs-6 mb-2'>Billing Value</label>
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
              name='Billing Value '
              autoComplete='off'
              disabled={formik.isSubmitting || isUserLoading}
              value={billing_value}
            />
            {/* end::Input */}
            {formik.touched.contract_end_date && formik.errors.contract_end_date && (
              <div className='fv-plugins-message-container'>
                <span role='alert'>{formik.errors.contract_end_date}</span>
              </div>
            )}
          </div>
          {/* end::Input group */}

           {/* begin::Input group */}
           <div className='fv-row mb-7'>
            {/* begin::Label */}
            <label className='disabled fw-bold fs-6 mb-2'>Client Name</label>
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
              name='Cotract End Date '
              autoComplete='off'
              disabled={formik.isSubmitting || isUserLoading}
              value={client_id.client_name}
            />
            {/* end::Input */}
            {formik.touched.contract_end_date && formik.errors.contract_end_date && (
              <div className='fv-plugins-message-container'>
                <span role='alert'>{formik.errors.contract_end_date}</span>
              </div>
            )}
          </div>
          {/* end::Input group */}

           {/* begin::Input group */}
           <div className='fv-row mb-7'>
            {/* begin::Label */}
            <label className='disabled fw-bold fs-6 mb-2'>Account Manager</label>
            {/* end::Label */}

            {/* begin::Input */}
            <input
              placeholder='Account Manager Name'
              {...formik.getFieldProps('accountManagerName')}
              className={clsx(
                'form-control form-control-solid mb-3 mb-lg-0',
                {'is-invalid': formik.touched.contract_end_date && formik.errors.contract_end_date},
                {
                  'is-valid': formik.touched.contract_end_date && !formik.errors.contract_end_date,
                }
              )}
              type='string'
              name='Account Manager'
              autoComplete='off'
              disabled={formik.isSubmitting || isUserLoading}
              value={associatedAccountManager.accountManagerName}
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
          </div>
           {/* end::Input group */ }
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
            type="submit"
             className="btn btn-primary"
             disabled={loading}
              
              >
              {!loading && "Save Changes"}
              {loading && (
               <span
                className="indicator-progress"
                 style={{ display: "block" }}
                   >
                  Updating Contract Expiry...{" "}
                 <span className="spinner-border spinner-bor  der-sm align-middle ms-2"></span>
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
