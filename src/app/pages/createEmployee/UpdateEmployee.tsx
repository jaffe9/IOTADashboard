import { useState, FC } from "react";
import {
  IProfileDetails,
  profileDetailsInitValues as initialValues,
} from "../../modules/accounts/components/settings/SettingsModel";
import * as Yup from "yup";
import { useFormik } from "formik";
import Flatpickr from "react-flatpickr";
import { apiHelper, updateEmployeeData } from "../../../apiFactory/apiHelper";
import {
  User,
  clients,
  temEmp,
} from "../../modules/apps/user-management/users-list/core/_models";

import ChipSelector from "./multiSelectDropDown";
import { Value } from "sass";
import { Contract } from "../../../_metronic/helpers";



// var allUserInfo: any = await apiHelper.getAllEmployees().then(async (data) => {
//   return data.data;
// });
var allUserInfo: any = await Promise.all(
  [ apiHelper.getAllEmployees(), apiHelper.getClientDetails(), apiHelper.getAccountManager() ,apiHelper.getContractDetails()]
).then(([employee,clients ,manager , contracts]) => {
  return { employee, clients:clients.data , manager , contracts:contracts.data}
})
let updatedUserInfo: IProfileDetails = initialValues;


const UpdateEmployee: FC = () => {
  const [data, setData] = useState<IProfileDetails>(updatedUserInfo);
  const updateData = (fieldsToUpdate: Partial<IProfileDetails>): void => {
    const updatedData = Object.assign(updatedUserInfo, fieldsToUpdate);
    setData(updatedData);
  };


  const handleContractChange = async ( contract_id : string) => {
    updateData({
      contract_id : contract_id,
    }) 
  }

  const handleAccountManagerChange = async (accountManagerid : number) => {
    updateData({
      associatedAccountManager: accountManagerid,
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
  const handleUserChange = async (id: number) => {
    var hasMatch = allUserInfo.employee.find(function (value: User) {
      return value.id == id
    });
    updateData({
      id : id ,
      uName : hasMatch.userName,
      fName: hasMatch.firstName,
      lName : hasMatch.lastName,
      fullName : hasMatch.fullName,
      email: hasMatch.email,
      occupation:hasMatch.occupation,
      companyName:hasMatch.companyName,
      phone : hasMatch.phone,
      language : hasMatch.language,
      employeeJoiningDate :hasMatch.employeeJoiningDate
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
        if( data.id === null  )
        {
          alert("Please select all fields")
          setLoading(false)
          return
        }
        const tempEmp : temEmp = {
          username: data.uName,
          password: data.password,
          email: data.email,
          firstName: data.fName,
          lastName: data.lName,
          fullName: data.fullName,
          occupation: data.occupation,
          companyName: data.companyName,
          phone: data.phone,
          language: data.language,
          timeZone: data.timeZone,
          address: data.address,
          client_id: data.client_id,
          contract_id : data.contract_id,
          associatedAccountManager: data.associatedAccountManager,
          id: data.id,
          employeeJoiningDate : data. employeeJoiningDate
        };
        console.log("updated employee response:" , tempEmp)
        const apiResponse = await updateEmployeeData(tempEmp)
      
        if (apiResponse.status === 204)
          {
            alert("Employee updated  Successful");
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
                <h3 className="fw-bolder m-0">Update Employee</h3>
              </div>
            </div>
            <div className="card-body border-top p-9">     
              <div className="row mb-6">
                     <label className="col-lg-4 col-form-label fw-bold fs-6">
                        <span className="required">Select Employee</span>
                      </label>
                      <div className="col-lg-8 fv-row">
                        <select
                            id="id"
                            className="form-select form-select-solid form-select-lg fw-bold"
                            {...formik.getFieldProps("id")}
                                  
                            onChange={async (e) => {
                            await handleUserChange(parseInt(e.target.value));
                             formik.setFieldValue("id", updatedUserInfo.id);
                                  }}
                            value={initialValues.id}
                                > 
                             <option value="">Select Employee</option>
                              {allUserInfo.employee.map((data: any, i: number) => (
                               <option key={i} value={data.id}>
                                 {data.username}
                              </option>
                                ))}
                            </select>
                              
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
                        {...formik.getFieldProps("fName")}
                        onChange={(value) => {
                          updateData({ fName: value.target.value });
                          formik.setFieldValue("firstName",updatedUserInfo.fName)
                        }}
                      />
                      {formik.touched.fName && formik.errors.fName && (
                        <div className="fv-plugins-message-container">
                          <div className="fv-help-block">
                            {formik.errors.fName}
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
                        {...formik.getFieldProps("lName")}
                        onChange={(value) => {
                          updateData({ lName: value.target.value });
                          formik.setFieldValue("lastName",updatedUserInfo.lName)
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
                       {...formik.getFieldProps("fullName")}
                        onChange={(value) => {
                          updateData({ fullName: value.target.value });
                          formik.setFieldValue("fullName",updatedUserInfo.fullName)
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
                        {...formik.getFieldProps("email")}
                        onChange={(value) => {
                          updateData({ email: value.target.value });
                          formik.setFieldValue("email",updatedUserInfo.email)
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
                        {...formik.getFieldProps("occupation")}
                        onChange={(value) => {
                          updateData({ occupation: value.target.value });
                          formik.setFieldValue("occupation",updatedUserInfo.occupation)
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
                      {...formik.getFieldProps("companyName")}
                      {...formik.getFieldProps("client_id")}
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
                        placeholder="Please Select Client Name"
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
                    <label className="col-lg-4 col-form-label required fw-bold fs-6">
                      Contract Id
                    </label>
                    <div className="col-lg-8 fv-row">
                      <select
                      id="contract_id"
                      className="form-select form-select-solid form-select-lg fw-bold"
                      {...formik.getFieldProps("contract_id")}
                    
                      onChange={async (e) => {
                        await handleContractChange(e.target.value);
                        formik.setFieldValue("contract_id", updatedUserInfo.contract_id);
                      
                      }}
                    value={initialValues.contract_id}
                    > 
                      <option value="">Select Contract </option>
                      {allUserInfo.contracts.map((data: any, i: number) => (
                        <option key={i} value={data.id}>
                          {data.associated_user_id?.fullName}
                        </option>
                      ))}
                    </select>
                    </div>
                  </div>

                  <div className="row mb-6">
                      <label className="col-lg-4 col-form-label fw-bold fs-6">
                        <span className="required">Joininig Date</span>
                      </label>
                    <div className="col-lg-8 fv-row">
                      <Flatpickr
                        className="form-control form-control-lg form-control-solid"
                        options={{
                          mode: "single",
                          dateFormat: "Y-M-D",
                        }}
                        onChange={(selectedDates) => {
                            updateData({ 
                              employeeJoiningDate: selectedDates.toLocaleString("en", {
                            year: "numeric",
                            month : "2-digit",
                            day : "2-digit",
                            }).replace(/\//g, "-") });                      
                        }}
                      />
                      {formik.touched.employeeJoiningDate && formik.errors.employeeJoiningDate && (
                       <div className="fv-plugins-message-container">
                        <div className="fv-help-block">
                          {formik.errors.employeeJoiningDate}
                        </div>
                       </div>)}
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
                        {...formik.getFieldProps("phone")}
                        onChange={(value) => {
                          updateData({ phone: value.target.value });
                          formik.setFieldValue("phone",updatedUserInfo.phone)
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
                      <input
                        type="text"
                        className="form-control form-control-lg form-control-solid"
                        {...formik.getFieldProps("language")}
                        onChange={(value) => {
                          updateData({ language: [value.target.value] });
                          formik.setFieldValue("language",updatedUserInfo.language)
                        }}
                      />
                        {/* <ChipSelector
                          value={formik.values.language} // Bind to Formik state
                          onChange={(selected) => {updateData({language:selected})
                          formik.setFieldValue("language",selected)
                        }}
                        /> */}
                        {formik.touched.language && formik.errors.language && (
                          <div className="fv-plugins-message-container">
                            <div className="fv-help-block">{formik.errors.language}</div>
                          </div>
                        )}
                      </div>
                    </div>
               

                  <div className="row mb-6">
                    <label className="col-lg-4 col-form-label fw-bold fs-6">
                      <span className="required">Address </span>
                    </label>
                    <div className="col-lg-8 fv-row">
                    <input
                        type="text"
                        className="form-control form-control-lg form-control-solid"
                        placeholder="Enter Address"
                        {...formik.getFieldProps("address")}
                        onChange={(value) => {
                          updateData({ address: value.target.value });
                          formik.setFieldValue("address",updatedUserInfo.address)
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
                    {...formik.getFieldProps("accountManagerName")}
                      
                      onChange={async (e) => {
                        await handleAccountManagerChange(parseInt(e.target.value));
                        formik.setFieldValue("associatedAccountManager", updatedUserInfo.associatedAccountManager);
                      }}
                    
                  > 
                    <option value="">Select Account Manager</option>
                    {allUserInfo.manager.map((data: any, i: number) => (
                      <option key={i} value={data.id} disabled={data.isDisabled == true}>
                        {data.accountManagerName}
                      </option>
                    ))}
                  </select>
                      {formik.touched.associatedAccountManager&& formik.errors.associatedAccountManager&& (
                        <div className="fv-plugins-message-container">
                          <div className="fv-help-block">
                            {formik.errors.associatedAccountManager}
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

export { UpdateEmployee };