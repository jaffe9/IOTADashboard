import { useState, FC } from "react";
import {
  IProfileDetails,
  profileDetailsInitValues as initialValues,
} from "../../modules/accounts/components/settings/SettingsModel";
import * as Yup from "yup";
import { useFormik } from "formik";
import Flatpickr from "react-flatpickr";
import { apiHelper, createClaimPage, uploadClaimsToSupabase } from "../../../apiFactory/apiHelper";
import {
  User,
  ClaimRequest,
  Expenses,
} from "../../modules/apps/user-management/users-list/core/_models";



// var allUserInfo: any = await apiHelper.getAllEmployees().then(async (data) => {
//   return data.data;
// });
var allUserInfo: any = await Promise.all(
  [ apiHelper.getAllEmployees(), apiHelper.getExpenses(), apiHelper.getAccountManager() ]
).then(([employee,expense ,manager]) => {
  return { employee:employee.data, expense:expense.data , manager:manager.data}
})
let updatedUserInfo: IProfileDetails = initialValues;
const profileDetailsSchema = Yup.object().shape({
  sEmployee: Yup.string().required("Please select an employee from list"),
  fName: Yup.string().required("First name is required"),
  lName: Yup.string().required("Last name is required"),
  company: Yup.string().required("Company name is required"),
  contactPhone: Yup.string().required("Contact phone is required"),
  companySite: Yup.string().required("Company site is required"),
  country: Yup.string().required("Country is required"),
  language: Yup.string().required("Language is required"),
  timeZone: Yup.string().required("Time zone is required"),
  currency: Yup.string().required("Currency is required"),
});


const ClaimPage: FC = () => {
  const [data, setData] = useState<IProfileDetails>(updatedUserInfo);
  const [ file , setFile ] = useState(null);
  const updateData = (fieldsToUpdate: Partial<IProfileDetails>): void => {
    const updatedData = Object.assign(updatedUserInfo, fieldsToUpdate);
    setData(updatedData);
  };

const handelFileChange = (event : any) => {
  setFile(event.target.files[0])
}
const handleClaimupload = async () => {
  if(!file){
    alert('Select Claim To Upload')
    return ;
  }
  try{
   await uploadClaimsToSupabase(file)
   alert('Claim Uploaded')
  }catch(error){
   console.error('Error in Claim Upload:',error)
  }
}

  const handleAccountManagerChange = async (accountManagerName : string) => {
    var hasMatch = allUserInfo.manager.find(function (value : Expenses){
      return value.expenseBy = accountManagerName;
    });
    updateData({
      expenseBy: accountManagerName,
    })
  }
  const handleChange = async (id : number) => {
    var hasMatch = allUserInfo.expense.find(function (value : Expenses){
      return value.expenseType = id;
    });
    updateData({
      expenseType: id,
      expenseTypeDesc:hasMatch.expenseTypeDesc,
    })
  }
  const handleUserChange = async (userName: string) => {
    var hasMatch = allUserInfo.employee.find(function (value: User) {
      return value.firstName == userName;
    });
    updateData({
      associatedUserId:hasMatch.id,
      fName: userName,
    });
  };

  const [loading, setLoading] = useState(false);
  const formik = useFormik<IProfileDetails>({
    initialValues,
    onSubmit:async () => {
      setLoading(true);
      setTimeout(async () => {
        const payload = {
          ...updatedUserInfo,
        };
        const updatedData = Object.assign(data, updatedUserInfo);
        setData(updatedData);
        if(data.expenseType < 1  )
        {
          alert("Please select all fields")
          setLoading(false)
          return
        }
        const ClaimRequest : ClaimRequest = {
          expenseType: data.expenseType,
          expenseDate: data.expenseDate,
          expenseBy: data.expenseBy,
          expenseAmount: data.expenseAmount,
          associatedUserId: data.associatedUserId,
          expenseTypeDesc: data.expenseTypeDesc,
        };
        const apiResponse = await createClaimPage(ClaimRequest)
        if (apiResponse.status === 201)
          {
            alert("Claim Successful");
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
    <div className="card mb-12">
      <div className="form">
        <div className="card-body">
          <div className="card mb-12 mb-xl-12">
            <div
              className="card-header border-0 cursor-pointer"
              role="button"
              data-bs-toggle="collapse"
              data-bs-target="#kt_account_profile_details"
              aria-expanded="true"
              aria-controls="kt_account_profile_details"
            >
              <div className="card-title m-0">
                <h3 className="fw-bolder m-0">Submit Claim</h3>
              </div>
            </div>
            <div className="card-body border-top p-9">
              <div className="row mb-6">
                <label className="col-lg-4 col-form-label fw-bold fs-6">
                  <span className="required">Select Employee</span>
                </label>
                <div className="col-lg-8 fv-row">
                  <select
                    id="associatedUserId"
                    className="form-select form-select-solid form-select-lg fw-bold"
                    {...formik.getFieldProps("associatedUserId")}
                    
                    onChange={async (e) => {
                      await handleUserChange(e.target.value);
                      formik.setFieldValue("associatedUserId", updatedUserInfo.associatedUserId);
                    }}
                    value={initialValues.fName}
                  > 
                    <option value="">Select Employee</option>
                    {allUserInfo.employee.map((data: any, i: number) => (
                      <option key={i} value={data.firstName}>
                        {data.firstName} 
                      </option>
                    ))}
                  </select>
                  {/* {formik.touched.sEmployee && formik.errors.sEmployee && (
                    <div className="fv-plugins-message-container">
                      <div className="fv-help-block">{formik.errors.sEmployee}</div>
                    </div>
                  )} */}
                </div>
              </div>
            </div>
            <div id="kt_account_profile_details" className="collapse show">
              <form onSubmit={formik.handleSubmit}  noValidate className="form">
                <div className="card-body border-top p-9">
                  <div className="row mb-6">
                    <label className="col-lg-4 col-form-label required fw-bold fs-6">
                      Expense Type
                    </label>
                    <div className="col-lg-8 fv-row">
                    <select
                    id="expenseType"
                    className="form-select form-select-solid form-select-lg fw-bold"
                    {...formik.getFieldProps("expenseType")}
                    
                    onChange={async (e) => {
                      await handleChange(parseInt(e.target.value));
                      formik.setFieldValue("expenseType", updatedUserInfo.expenseType);
                      formik.setFieldValue("expenseTypeDEsc",updatedUserInfo.expenseTypeDesc);
                    }}
                   // value={initialValues.expenseType}
                  > 
                    <option value="">Select Expense Type</option>
                    {allUserInfo.expense.map((data: any, i: number) => (
                      <option key={i} value={data.id}>
                        {data.id} - {data.expenseTypeDesc}
                      </option>
                    ))}
                  </select>
                      {formik.touched.expenseType && formik.errors.expenseType && (
                        <div className="fv-plugins-message-container">
                          <div className="fv-help-block">
                            {formik.errors.expenseType}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="row mb-6">
                    <label className="col-lg-4 col-form-label  fw-bold fs-6 required"> 
                      Expense Type Desc
                    </label>
                    <div className="col-lg-8 fv-row">
                      <input
                        type="text"
                        className="form-control form-control-lg form-control-solid"
                        placeholder="Expense Type Description"
                       // {...formik.getFieldProps("expenseTypeDesc")}
                        onChange={(value) => {
                          updateData({ expenseTypeDesc: value.target.value });
                          formik.setFieldValue("expenseTypeDesc",value.target.value)
                        }}
                      />
                      {formik.touched.expenseTypeDesc && formik.errors.expenseTypeDesc && (
                        <div className="fv-plugins-message-container">
                          <div className="fv-help-block">
                            
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="row mb-6">
                    <label className="col-lg-4 col-form-label required fw-bold fs-6">
                      Expense Amount
                    </label>
                    <div className="col-lg-8 fv-row">
                    
                      <input
                      type="text"
                      className="form-control form-control-lg form-control-solid"
                      placeholder="Enter Total Amount"
                      
                      onChange={(value) => {
                        updateData({ expenseAmount: value.target.value });
                        formik.setFieldValue("expenseAmount",value.target.value)
                        }}
                      >
                        
                      </input>
                    </div>
                  </div>
                  <div className="row mb-6">
                    <label className="col-lg-4 col-form-label fw-bold fs-6">
                      <span className="required">Expense Date</span>
                    </label>
                    <div className="col-lg-8 fv-row">
                    <Flatpickr
                        className="form-control form-control-lg form-control-solid"
                        options={{
                          mode: "single",
                          dateFormat: "d-m-Y",
                        }}
                        onChange={(dateStr) => {
                          updateData({ expenseDate: dateStr.toLocaleString("en",{
                            year: "numeric",
                            month: "2-digit",
                            day : "2-digit"
                            }).replace(/\//g, "-") });
                        }}
                      ></Flatpickr>
                      {formik.touched.expenseDate && formik.errors.expenseDate && (
                        <div className="fv-plugins-message-container">
                          <div className="fv-help-block">
                            {formik.errors.expenseDate}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="row mb-6">
                    <label className="col-lg-4 col-form-label  fw-bold fs-6">
                      File Upload
                    </label>
                    <div className="col-lg-8 fv-row">
                    <div className="input-group"> 
                      <input
                      type="file"
                      className="form-control form-control-lg form-control-solid"
                      placeholder="Upload TimeSheet"
                      onChange={handelFileChange}
                      />
                      <span className="input-group-badge badge badge-success cursor-pointer"
                        onClick={handleClaimupload}>
                        Click To Upload
                        </span>
                        </div>
                     
                    </div>
                    </div>

                  <div className="row mb-6">
                    <label className="col-lg-4 col-form-label fw-bold fs-6 required">
                      <span className="">Expense By</span>
                    </label>
                    <div className="col-lg-8 fv-row">
                    <select
                    id="expenseBy"
                    className="form-select form-select-solid form-select-lg fw-bold"
                    {...formik.getFieldProps("expenseBy")}
                    
                    onChange={async (e) => {
                      await handleAccountManagerChange(e.target.value);
                      formik.setFieldValue("expenseBy", updatedUserInfo.expenseBy);
                    }}
                    //value={initialValues.expenseBy}
                  > 
                    <option value="">Select Account Manager</option>
                    {allUserInfo.manager.map((data: any, i: number) => (
                      <option key={i} value={data.accountManagerName}>
                        {data.accountManagerName}
                      </option>
                    ))}
                  </select>
                      {formik.touched.expenseBy && formik.errors.expenseBy && (
                        <div className="fv-plugins-message-container">
                          <div className="fv-help-block">
                            {formik.errors.expenseBy}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>                  
                </div>
                
                <div className="card-footer d-flex justify-content-end py-6 px-9">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                    onClick={this}
                    
                  >
                    {!loading && "Save Changes"}
                    {loading && (
                      <span
                        className="indicator-progress"
                        style={{ display: "block" }}
                      >
                        Please wait...{" "}
                        <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
                      </span>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { ClaimPage };