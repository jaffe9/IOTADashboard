import { useState, FC } from "react";
import {
  IProfileDetailsContract,
  profileDetailsInitValuesContract as initialValues,
} from "../../modules/accounts/components/settings/SettingsModel";
import * as Yup from "yup";
import { useFormik } from "formik";
import Flatpickr from "react-flatpickr";
import { apiHelper,  createContractPage,  uploadContractToSupabase } from "../../../apiFactory/apiHelper";
import {
  User,
  ContractRequest,
  Contract
} from "../../modules/apps/user-management/users-list/core/_models";



var allUserInfo: any = await Promise.all(
  [ apiHelper.getAllEmployees(), apiHelper.getAccountManager() ]
).then(([employee ,manager]) => {
  return { employee:employee.data , manager:manager.data}
})
let updatedUserInfo: IProfileDetailsContract = initialValues;
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

const ContractPage: FC = () => {
  const [data, setData] = useState<IProfileDetailsContract>(updatedUserInfo);
  const [file,setFile] = useState(null)
  const updateData = (fieldsToUpdate: Partial<IProfileDetailsContract>): void => {
    const updatedData = Object.assign(updatedUserInfo, fieldsToUpdate);
    setData(updatedData);
  };

  const handleFileChange = (event:any ) =>{
    setFile(event.target.files[0])
  }
  const handleContractUpload = async() =>{
    if(!file){
      alert("Please Select .pdf fomrat Contract")
      return ;
    }
     // Check if the uploaded file is in .pdf format
  if (file !== "application/pdf") {
    alert("Only .pdf files are allowed. Please select a valid .pdf file.");
    return;
  }
    try{
     await uploadContractToSupabase(file)
    }catch(error){
     console.error("Error Uploading Contract:",error)
    }
  }

  const handleAccountManagerChange = async ( id : number) => {
    var hasMatch = allUserInfo.manager.find(function(value: Contract){
      return value.associatedAccountManager = id;
    });
      updateData({
        associatedAccountManager : hasMatch.id
      })
  }

  const handleUserChange = async (contract_id: string) => {
    var hasMatch = allUserInfo.employee.find(function (value: User) {
      return value.contract_id == contract_id;
    });
    const today = new Date();
    const currentMonth = new Date();
    //previousMonth.setMonth(today.getMonth() - 1);
    updateData({
      client_id: hasMatch.clientId,
     // fName: userName,
      contract_no : hasMatch.employeeId+"_"+currentMonth
      .toLocaleDateString("en-IN",{
      year: "numeric",
      month: "2-digit",
      }).replace(/\//g, "_"),
      associated_user_id:hasMatch.id
    });
  };

  const [loading, setLoading] = useState(false);
  const formik = useFormik<IProfileDetailsContract>({
    initialValues,
    onSubmit: () => {
      setLoading(true);
      setTimeout( async () => {
        const updatedData = Object.assign(data, updatedUserInfo);
        setData(updatedData);
        console.log(updatedData);
        if(   data.client_id.length < 1 )
        {

          alert("Please select all fields")
          setLoading(false)
          return
        }
        let invoiceRequest : ContractRequest = {
          client_id: data.client_id,
          contract_no : data.contract_no,
          billing_value: data.billing_value,
          billing_start_date : data.billing_start_date,
          billing_end_date : data.billing_end_date,
          billing_months : data.billing_months,
          associatedAccountManager : data.associatedAccountManager,
          associated_user_id:data.associated_user_id


        };
        var apiResponse = await createContractPage(invoiceRequest)
        if (apiResponse.status === 201)
          {
            alert("Invoice Submitted Successfully");
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
                <h3 className="fw-bolder m-0">Submit Contract</h3>
              </div>
            </div>
            <div className="card-body border-top p-9">
              <div className="row mb-6">
                <label className="col-lg-4 col-form-label fw-bold fs-6">
                  <span className="required">Employee Name</span>
                </label>
                <div className="col-lg-8 fv-row">
                  <select
                    id="associated_user_id"
                    className="form-select form-select-solid form-select-lg fw-bold"
                    {...formik.getFieldProps("associated_user_id")}
                    
                    onChange={async (e) => {
                      await handleUserChange(e.target.value);
                      formik.setFieldValue("client_id", updatedUserInfo.client_id);
                      formik.setFieldValue("associated_user_id", updatedUserInfo.associated_user_id);
                    
                    }}
                    value={initialValues.associated_user_id}
                  > 
                    <option value="">Select ID</option>
                    {allUserInfo.employee.map((data: any, i: number) => (
                      <option key={i} value={data.contract_id}>
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
            <form
                onSubmit={(e) => {
                  e.preventDefault(); // Prevent default form submission
                  formik.handleSubmit();
                }}
                noValidate
                className="form"
              >
                <div className="card-body border-top p-9">
                  <div className="row mb-6">
                    <label className="col-lg-4 col-form-label  fw-bold fs-6"> 
                      Client Id
                    </label>
                    <div className="col-lg-8 fv-row">
                      <input
                        type="text"
                        className="form-control form-control-lg form-control-solid"
                        placeholder="Client Id"
                        {...formik.getFieldProps("client_id")}
                        onChange={(value) => {
                          updateData({ client_id: value.target.value });
                          formik.setFieldValue("client_id",value.target.value)
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
                    <label className="col-lg-4 col-form-label  fw-bold fs-6">
                      Employee Id
                    </label>
                    <div className="col-lg-8 fv-row">
                      <input
                        type="text"
                        className="form-control form-control-lg form-control-solid"
                        placeholder="Associated User Id"
                        {...formik.getFieldProps("associated_user_id")}
                        
                      />
                      {formik.touched.associated_user_id && formik.errors.associated_user_id && (
                        <div className="fv-plugins-message-container">
                          <div className="fv-help-block">
                            
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="row mb-6">
                    <label className="col-lg-4 col-form-label  fw-bold fs-6">
                      Contract No
                    </label>
                    <div className="col-lg-8 fv-row">
                      <input
                        type="text"
                        className="form-control form-control-lg form-control-solid"
                        placeholder="Internal Invoice Number"
                        {...formik.getFieldProps("contract_no")}
                        onChange={(value) => {
                          updateData({ contract_no: value.target.value});
                          formik.setFieldValue("contract_no",value.target.value)
                        }}
                      />
                      {formik.touched.contract_no && formik.errors.contract_no && (
                        <div className="fv-plugins-message-container">
                          <div className="fv-help-block">
                            
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="row mb-6">
                    <label className="col-lg-4 col-form-label required fw-bold fs-6">
                      Billing Value
                    </label>
                    <div className="col-lg-8 fv-row">
                    
                      <input
                      type="text"
                      className="form-control form-control-lg form-control-solid"
                      placeholder="Enter Billing Vaule"
                      
                      onChange={(value) => {
                        updateData({ billing_value: value.target.value });
                        formik.setFieldValue("billing_value",value.target.value)
                        }}
                      > 
                      </input>
                    </div>
                  </div>
                  <div className="row mb-6">
                    <label className="col-lg-4 col-form-label fw-bold fs-6">
                      <span className="required">Billing Start Date</span>
                    </label>
                    <div className="col-lg-8 fv-row">
                    <Flatpickr
                        className="form-control form-control-lg form-control-solid"
                        options={{
                          mode: "single",
                          dateFormat: "d-m-Y",
                        }}
                        onChange={(dateStr) => {
                          updateData({ billing_start_date: dateStr.toLocaleString("en-IN",{
                            year: "numeric",
                            month: "2-digit",
                            day : "2-digit"
                            }).replace(/\//g, "-") });
                        }}
                      ></Flatpickr>
                      {formik.touched.billing_start_date && formik.errors.billing_start_date && (
                        <div className="fv-plugins-message-container">
                          <div className="fv-help-block">
                            {formik.errors.billing_start_date}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="row mb-6">
                    <label className="col-lg-4 col-form-label fw-bold fs-6">
                      <span className="required">Billing End Date</span>
                    </label>
                    <div className="col-lg-8 fv-row">
                    <Flatpickr
                        className="form-control form-control-lg form-control-solid"
                        options={{
                          mode: "single",
                          dateFormat: "d-m-Y",
                        }}
                        onChange={(dateStr) => {
                          updateData({ billing_end_date: dateStr.toLocaleString("en-IN",{
                            year: "numeric",
                            month: "2-digit",
                            day : "2-digit"
                            }).replace(/\//g, "-") });
                        }}
                      ></Flatpickr>
                      {formik.touched.billing_end_date && formik.errors.billing_end_date && (
                        <div className="fv-plugins-message-container">
                          <div className="fv-help-block">
                            {formik.errors.billing_end_date}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="row mb-6">
                    <label className="col-lg-4 col-form-label required fw-bold fs-6">
                      Billing Months
                    </label>
                    <div className="col-lg-8 fv-row">
                    
                      <input
                      type="text"
                      className="form-control form-control-lg form-control-solid"
                      placeholder="Enter Total Number Of Months "
                      
                      onChange={(value) => {
                        updateData({ billing_months: parseInt(value.target.value) });
                        formik.setFieldValue("billing_months",value.target.value)
                        }}
                      >
                      </input>
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
                      placeholder="Upload Contract"
                      onChange={handleFileChange}
                      />
                      <span className="input-group-badge badge badge-success cursor-pointer"
                      onClick={handleContractUpload}>
                        Click To Upload
                        </span>
                        </div>
                     
                    </div>
                    </div>

                    <div className="row mb-6">
                    <label className="col-lg-4 col-form-label fw-bold fs-6 required">
                      <span className="">Contract By</span>
                    </label>
                    <div className="col-lg-8 fv-row">
                    <select
                    id="associatedAccountManager"
                    className="form-select form-select-solid form-select-lg fw-bold"
                    {...formik.getFieldProps("associatedAccountManager")}
                    
                    onChange={async (e) => {
                      await handleAccountManagerChange(parseInt(e.target.value));
                      formik.setFieldValue("associatedAccountManager", updatedUserInfo.associatedAccountManager);
                    }}
                    
                  > 
                    <option value="">Select Account Manager</option>
                    {allUserInfo.manager.map((data: any, i: number) => (
                      <option key={i} value={data.id}>
                        {data.accountManagerName} 
                      </option>
                    ))}
                  </select>
                      {formik.touched.associatedAccountManager && formik.errors.associatedAccountManager && (
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

export { ContractPage };
