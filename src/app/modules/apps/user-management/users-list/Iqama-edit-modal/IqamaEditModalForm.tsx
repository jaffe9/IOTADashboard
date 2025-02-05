import {FC, useState} from 'react'
import * as Yup from 'yup'
import {useFormik} from 'formik'
import Flatpickr from "react-flatpickr";
import {Iqama, isNotEmpty, toAbsoluteUrl} from '../../../../../../_metronic/helpers'
import {initialUser, National_id, payslipOptions, User} from '../core/_models'
import clsx from 'clsx'
import {UsersListLoading} from '../components/loading/UsersListLoading'
import {useQueryResponse} from '../core/QueryResponseProvider'
import { useIqamaListView } from '../core/IqamaListViewProvider'
import { IProfileDetailsNationalId, profileDetailsInitValuesNationalId as initialValues } from '../../../../accounts/components/settings/SettingsModel'
import { UpdateIqamaExp, getEmpForIqamaInForm } from '../core/_requests';





var allUserInfo: any = await getEmpForIqamaInForm().then(async (data) => {
  return data.data;
});

type Props = {
  isUserLoading: boolean
  payslipOption: payslipOptions
  user: User
  iqama:National_id
  national_id : number
  expiry_date : string
  associated_user_id:{username:string,email:string}
  payslipOptions:payslipOptions
  id: number | undefined
}
let updatedUserInfo:IProfileDetailsNationalId = initialValues;




const UserEditModalFormIqama: FC<Props> = ({user, iqama , isUserLoading, associated_user_id,national_id,expiry_date  }) => {
const {setItemIqamaForUpdate} = useIqamaListView()
const {refetch} = useQueryResponse()
const [ data , setData ] = useState<IProfileDetailsNationalId>(updatedUserInfo)
 const updateData = (fieldsToUpdate: Partial<IProfileDetailsNationalId>): void => {
    const updatedData = Object.assign(updatedUserInfo, fieldsToUpdate);
    setData(updatedData);
  };

 const handleUserChange = async (id: number) => {
  const hasMatch = allUserInfo.find((value: National_id) => value.id === id);
  if (!hasMatch) return;

  if (hasMatch.associated_user_id.username !== selectedUser.associated_user_id.username) {
    alert("Selected employee name does not match the displayed Employee Name field.");
  }
    updateData({
       id : id,
       national_id: hasMatch.national_id,
       expiry_date : hasMatch.expiry_date,
       associated_user_id : hasMatch.associated_user_id,
    });
  };


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
  const  cancel = (withRefresh?: boolean) => 
    {
     // alert("Cancelled")
      if (withRefresh) 
        {
          refetch()
          
        }
      setItemIqamaForUpdate(undefined)
    }

   const [loading, setLoading] = useState(false);
   const formik = useFormik<IProfileDetailsNationalId>({
     initialValues,
     onSubmit:async () => {
       setLoading(true);
       setTimeout(async () => {
         const updatedData = Object.assign(data, updatedUserInfo);
         setData(updatedData);
         if(  !data.id )
         {
           alert(`Please Select Employee From Select Field `)
           setLoading(false)
           return
         }
         const iqama : National_id = {
          id : data.id,
          national_id: data.national_id,
          expiry_date : data.expiry_date,
          associated_user_id : data.associated_user_id
           };
                 console.log("updated salary  response:" , iqama)
                 const apiResponse = await UpdateIqamaExp(iqama)
               
                 if (apiResponse.status === 204)
                   {
                     alert("Iqama updated Successful");
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
              placeholder='Full name'
              {...formik.getFieldProps('firstName')}
              type='text'
              name='firstName'
              className={clsx(
                'form-control form-control-solid mb-3 mb-lg-0',
                {'is-invalid': formik.touched.associated_user_id && formik.errors.associated_user_id},
                {
                  'is-valid': formik.touched.associated_user_id && !formik.errors.associated_user_id,
                }
              )}
              autoComplete='off'
              disabled={formik.isSubmitting || isUserLoading}
              value = {selectedUser.associated_user_id?.username}
            />
            {formik.touched.associated_user_id && formik.errors.associated_user_id && (
              <div className='fv-plugins-message-container'>
                <div className='fv-help-block'>
                  <span role='alert'>{formik.errors.associated_user_id}</span>
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
                <span role='alert'>{formik.errors.associated_user_id}</span>
              </div>
            )}
          </div>
          {/* end::Input group */}

          {/* Begin Basic Allowance Information*/}

           {/* begin::Input group */}
           <div className='fv-row mb-7'>
            {/* begin::Label */}
            <label className='disabled fw-bold fs-6 mb-2 required'>Select Employee</label>
            {/* end::Label */}

            {/* begin::Input */}
            <select
              id="id"
               className="form-select form-select-solid form-select-lg fw-bold required"
                 {...formik.getFieldProps("associated_user_id.username")}
                required  
                onChange={async (value) => {
                 await  handleUserChange(parseInt(value.target.value));
                 formik.setFieldValue("associated_user_id.username",updatedUserInfo.id)
                   }}
                    //  value={initialValues.user_id}
                    > 
                      <option value="" disabled >Select Employee </option>
                      {allUserInfo.map((data: any, i: number) => (
                        <option key={i} value={data.id} hidden={data.id==1}>
                          {data.associated_user_id.username}
                        </option>
                      ))}
                    </select>
            {/* end::Input */}
          </div>
          {/* end::Input group */}


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

           
          <div className='fv-row mb-7'>
            {/* begin::Label */}
            <label className='disabled fw-bold fs-6 mb-2'>Current Expiry Date</label>
            {/* end::Label */}

            {/* begin::Input */}
            <input
              placeholder='Iqama Number'
              {...formik.getFieldProps('string')}
              className={clsx(
                'form-control form-control-solid mb-3 mb-lg-0',
                {'is-invalid': formik.touched.expiry_date && formik.errors.expiry_date},
                {
                  'is-valid': formik.touched.expiry_date && !formik.errors.expiry_date,
                }
              )}
              type='string'
              name='National Id'
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

          {/* End of Basic Salary Information*/}


          {/* Begin Expiry Date Information*/}

          {/* begin::Input group */}
          <div className='fv-row mb-7'>
            {/* begin::Label */}
            <label className='disabled fw-bold fs-6 mb-2'>Update Expiry Date</label>
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
                 updateData({ expiry_date: dateStr.toLocaleString("en",{
                 year: "numeric",
                 month: "2-digit",
                 day : "2-digit"
                  }).replace(/\//g, "-") });
                  }}
                 ></Flatpickr>        
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
                  Updating Iqama Expiry...{" "}
                 <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
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
