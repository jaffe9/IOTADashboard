import { useState, FC } from "react";
import {
  IProfileDetails,
  profileDetailsInitValues as initialValues,
} from "../../modules/accounts/components/settings/SettingsModel";
import * as Yup from "yup";
import { useFormik } from "formik";
import Flatpickr from "react-flatpickr";
import { apiHelper, createTempEmployee } from "../../../apiFactory/apiHelper";
import {
  User,
  clients,
  temEmp,
} from "../../modules/apps/user-management/users-list/core/_models";

import ChipSelector from "./multiSelectDropDown";
import { Value } from "sass";



// var allUserInfo: any = await apiHelper.getAllEmployees().then(async (data) => {
//   return data.data;
// });
var allUserInfo: any = await Promise.all(
  [ apiHelper.getAllEmployees(), apiHelper.getClientDetails(), apiHelper.getAccountManager() ]
).then(([employee,clients ,manager]) => {
  return { employee:employee.data, clients:clients.data , manager:manager.data}
})
let updatedUserInfo: IProfileDetails = initialValues;


const CreateEmployee: FC = () => {
  const [data, setData] = useState<IProfileDetails>(updatedUserInfo);
  const updateData = (fieldsToUpdate: Partial<IProfileDetails>): void => {
    const updatedData = Object.assign(updatedUserInfo, fieldsToUpdate);
    setData(updatedData);
  };


  const handleAccountManagerChange = async (accountManagerid : number) => {
    updateData({
      associated_account_manager: accountManagerid,
    })    
  }
  const handleChange = async (client_name : string) => {
    var hasMatch = allUserInfo.clients.find(function (value : clients){
      return value.client_name == client_name;
    });
    updateData({
      client_id : hasMatch.id,
      companyName : hasMatch.client_name,
    })
  }
  const handleUserChange = async (userName: string) => {
    var hasMatch = allUserInfo.employee.find(function (value: User) {
      return value.firstName == userName;
    });
    updateData({
      uName : userName,
      fName: hasMatch.firstName,
    });
  };

  const [loading, setLoading] = useState(false);
  const formik = useFormik<IProfileDetails>({
    initialValues,
    onSubmit:async () => {
      setLoading(true);
      setTimeout(async () => {
        const updatedData = Object.assign(data, updatedUserInfo);
        setData(updatedData);
        if(data.client_id < 1 || data.associated_account_manager == null || data.uName == null || data.fullName == null  )
        {
          alert("Please select all fields")
          setLoading(false)
          return
        }
        const tempEmp : temEmp = {
          username : data.uName,
          password : data.password,
          email : data.email,
          firstName : data.fName,
          lastName : data.lName,
          fullName : data.fullName,
          occupation : data.occupation,
          companyName : data.companyName,
          phone : data.phone,
          language: data.language,
          timeZone : data.timeZone,
          address : data.address,
          clientId : data.client_id,
          associated_account_manager : data.associated_account_manager,
        };
        console.log("Temp employee response:" , tempEmp)
        const apiResponse = await createTempEmployee(tempEmp)
      
        if (apiResponse.status === 201)
          {
            alert("Employee created  Successful");
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
                <h3 className="fw-bolder m-0">Create Employee</h3>
              </div>
            </div>
            <div className="card-body border-top p-9">
              <div className="row mb-6">
                <label className="col-lg-4 col-form-label fw-bold fs-6">
                  <span className="required">Employee Name</span>
                </label>
                <div className="col-lg-8 fv-row">
                <input
                        type="text"
                        className="form-control form-control-lg form-control-solid"
                        placeholder="Enter User Name"
                
                        onChange={(value) => {
                          updateData({ uName: value.target.value });
                          formik.setFieldValue("username",value.target.value)
                        }}
                      />
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
                      Enter First Name
                    </label>
                    <div className="col-lg-8 fv-row">
                    <input
                        type="text"
                        className="form-control form-control-lg form-control-solid"
                        placeholder="Enter First Name"
                       // {...formik.getFieldProps("expenseTypeDesc")}
                        onChange={(value) => {
                          updateData({ fName: value.target.value });
                          formik.setFieldValue("firstName",value.target.value)
                        }}
                      />
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
                    <label className="col-lg-4 col-form-label required fw-bold fs-6">
                      Enter Last Name
                    </label>
                    <div className="col-lg-8 fv-row">
                    <input
                        type="text"
                        className="form-control form-control-lg form-control-solid"
                        placeholder="Enter Last Name"
                        onChange={(value) => {
                          updateData({ lName: value.target.value });
                          formik.setFieldValue("lastName",value.target.value)
                        }}
                      />
                      {formik.touched.lName && formik.errors.lName && (
                        <div className="fv-plugins-message-container">
                          <div className="fv-help-block">
                            {formik.errors.lName}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="row mb-6">
                    <label className="col-lg-4 col-form-label required fw-bold fs-6">
                      Enter Full Name
                    </label>
                    <div className="col-lg-8 fv-row">
                    <input
                        type="text"
                        className="form-control form-control-lg form-control-solid"
                        placeholder="Enter Full Name"
                       // {...formik.getFieldProps("expenseTypeDesc")}
                        onChange={(value) => {
                          updateData({ fullName: value.target.value });
                          formik.setFieldValue("fullName",value.target.value)
                        }}
                      />
                      {formik.touched.fullName && formik.errors.fullName && (
                        <div className="fv-plugins-message-container">
                          <div className="fv-help-block">
                            {formik.errors.fullName}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                 
                  <div className="row mb-6">
                    <label className="col-lg-4 col-form-label required fw-bold fs-6">
                      Enter Email
                    </label>
                    <div className="col-lg-8 fv-row">
                    <input
                        type="text"
                        className="form-control form-control-lg form-control-solid"
                        placeholder="Enter Eamil"
                    
                        onChange={(value) => {
                          updateData({ email: value.target.value });
                          formik.setFieldValue("email",value.target.value)
                        }}
                      />
                      {formik.touched.email && formik.errors.email && (
                        <div className="fv-plugins-message-container">
                          <div className="fv-help-block">
                            {formik.errors.email}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="row mb-6">
                    <label className="col-lg-4 col-form-label required fw-bold fs-6">
                      Enter Occupation
                    </label>
                    <div className="col-lg-8 fv-row">
                    <input
                        type="text"
                        className="form-control form-control-lg form-control-solid"
                        placeholder="Enter Position of Employee"
                       // {...formik.getFieldProps("expenseTypeDesc")}
                        onChange={(value) => {
                          updateData({ occupation: value.target.value });
                          formik.setFieldValue("occupation",value.target.value)
                        }}
                      />
                      {formik.touched.occupation && formik.errors.occupation && (
                        <div className="fv-plugins-message-container">
                          <div className="fv-help-block">
                            {formik.errors.occupation}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="row mb-6">
                    <label className="col-lg-4 col-form-label required fw-bold fs-6">
                      Client Name
                    </label>
                    <div className="col-lg-8 fv-row">
                      <select
                      id="companyName"
                      className="form-select form-select-solid form-select-lg fw-bold"
                      {...formik.getFieldProps("client_name")}
                      
                      onChange={async (e) => {
                        await handleChange(e.target.value);
                        formik.setFieldValue("companyName", updatedUserInfo.companyName);
                        formik.setFieldValue("client_id",updatedUserInfo.client_id)
                      }}
                    value={initialValues.companyName}
                    > 
                      <option value="">Select Client </option>
                      {allUserInfo.clients.map((data: any, i: number) => (
                        <option key={i} value={data.client_name}>
                          {data.client_name}
                        </option>
                      ))}
                    </select>
                    </div>
                  </div>

                  <div className="row mb-6">
                    <label className="col-lg-4 col-form-label  fw-bold fs-6"> 
                      Client Id
                    </label>
                    <div className="col-lg-8 fv-row">
                      <input
                        readOnly
                        type="text"
                        className="form-control form-control-lg form-control-solid"
                        placeholder="Client Id"
                        {...formik.getFieldProps("client_id")}
                        onChange={async (e) => {
                          await handleChange(e.target.value);
                          
                        }}
                      />
                      {formik.touched.client_id && formik.errors.client_id && (
                        <div className="fv-plugins-message-container">
                          <div className="fv-help-block">
                            
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="row mb-6">
                    <label className="col-lg-4 col-form-label fw-bold fs-6">
                      <span className="required">Phone </span>
                    </label>
                    <div className="col-lg-8 fv-row">
                    <input
                        type="text"
                        className="form-control form-control-lg form-control-solid"
                        placeholder="Enter Phone number"
                       // {...formik.getFieldProps("expenseTypeDesc")}
                        onChange={(value) => {
                          updateData({ phone: value.target.value });
                          formik.setFieldValue("phone",value.target.value)
                        }}
                      />
                      {formik.touched.phone && formik.errors.phone && (
                        <div className="fv-plugins-message-container">
                          <div className="fv-help-block">
                            {formik.errors.phone}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                   
                  <div className="row mb-6">
                      <label className="col-lg-4 col-form-label fw-bold fs-6">
                        <span className="required">Language</span>
                      </label>
                      <div className="col-lg-8 fv-row">
                        <ChipSelector
                          value={formik.values.language} // Bind to Formik state
                          onChange={(selected) => {updateData({language:selected})
                          formik.setFieldValue("language",selected)
                        }}
                        />
                        {formik.touched.language && formik.errors.language && (
                          <div className="fv-plugins-message-container">
                            <div className="fv-help-block">{formik.errors.language}</div>
                          </div>
                        )}
                      </div>
                    </div>
                  {/* <div className="row mb-6">
                    <label className="col-lg-4 col-form-label fw-bold fs-6">
                      <span className="required">TimeZone </span>
                    </label>
                    <div className="col-lg-8 fv-row">
                    <select
                        className='form-select form-select-lg form-select-solid'
                        data-control='select2'
                        data-placeholder='Select TiemZone...'
      
                        onChange={(e) => updateData({timeZone: e.target.value})}
                      >
                         <option hidden>Select TimeZone</option>
                          <option value="AST">Arab Standard Time</option>
                      </select>
            
                      {formik.touched.timeZone&& formik.errors.timeZone&& (
                        <div className="fv-plugins-message-container">
                          <div className="fv-help-block">
                            {formik.errors.timeZone}
                          </div>
                        </div>
                      )}
                    </div>
                  </div> */}

                  <div className="row mb-6">
                    <label className="col-lg-4 col-form-label fw-bold fs-6">
                      <span className="required">Address </span>
                    </label>
                    <div className="col-lg-8 fv-row">
                    <input
                        type="text"
                        className="form-control form-control-lg form-control-solid"
                        placeholder="Enter Address"
                       // {...formik.getFieldProps("expenseTypeDesc")}
                        onChange={(value) => {
                          updateData({ address: value.target.value });
                          formik.setFieldValue("address",value.target.value)
                        }}
                      />
                      {formik.touched.address && formik.errors.address && (
                        <div className="fv-plugins-message-container">
                          <div className="fv-help-block">
                            {formik.errors.address}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="row mb-6">
                    <label className="col-lg-4 col-form-label fw-bold fs-6 required">
                      <span className="">Created By</span>
                    </label>
                    <div className="col-lg-8 fv-row">
                    <select
                    id="accountManger"
                    className="form-select form-select-solid form-select-lg fw-bold"
                    
                    
                    onChange={async (e) => {
                      await handleAccountManagerChange(parseInt(e.target.value));
                      formik.setFieldValue("associated_account_maager", updatedUserInfo.associated_account_manager);
                    }}
                    
                  > 
                    <option value="">Select Account Manager</option>
                    {allUserInfo.manager.map((data: any, i: number) => (
                      <option key={i} value={data.id} disabled={data.isDisabled == true}>
                        {data.accountManagerName}
                      </option>
                    ))}
                  </select>
                      {formik.touched.associated_account_manager&& formik.errors.associated_account_manager&& (
                        <div className="fv-plugins-message-container">
                          <div className="fv-help-block">
                            {formik.errors.associated_account_manager}
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

export { CreateEmployee };