import { useState, FC } from "react";
import {
  IProfileDetailsInvoice,
  profileDetailsInitValuesInvoice as initialValues,
} from "../../modules/accounts/components/settings/SettingsModel";
import * as Yup from "yup";
import { useFormik } from "formik";
import Flatpickr from "react-flatpickr";
import { apiHelper, createEmployeeInvoice } from "../../../apiFactory/apiHelper";
import {
  User,
  InvoiceRequest
} from "../../modules/apps/user-management/users-list/core/_models";



var allUserInfo: any = await apiHelper.getAllEmployees().then(async (data) => {
  return data.data;
});
let updatedUserInfo: IProfileDetailsInvoice = initialValues;
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

const EmployeeInvoice: FC = () => {
  const [data, setData] = useState<IProfileDetailsInvoice>(updatedUserInfo);
  const updateData = (fieldsToUpdate: Partial<IProfileDetailsInvoice>): void => {
    const updatedData = Object.assign(updatedUserInfo, fieldsToUpdate);
    setData(updatedData);
  };
  const handleUserChange = async (contract_id: string) => {
    var hasMatch = allUserInfo.find(function (value: User) {
      return value.contract_id == contract_id;
    });
    const today = new Date();
    const previousMonth = new Date();
    previousMonth.setMonth(today.getMonth() - 1);
    updateData({
      client_id: hasMatch.clientId,
     // fName: userName,
      internal_invoice_no: hasMatch.employeeId+"_"+previousMonth
      .toLocaleDateString("en-IN",{
      year: "numeric",
      month: "2-digit",
      }).replace(/\//g, "_"),
      contract_id:contract_id,
    });
  };

  const [loading, setLoading] = useState(false);
  const formik = useFormik<IProfileDetailsInvoice>({
    initialValues,
    onSubmit: () => {
      setLoading(true);
      setTimeout(async () => {
        const payload = {
          ...updatedUserInfo,
        };
        const updatedData = Object.assign(data, updatedUserInfo);
        setData(updatedData);
        console.log(updatedData);
        if(   data.client_id.length < 1 || data.invoice_date.length < 1)
        {

          alert("Please select all fields")
          setLoading(false)
          return
        }
        let invoiceRequest : InvoiceRequest = {
          contract_id: data.contract_id,
          client_id: data.client_id,
          internal_invoice_no: data.internal_invoice_no,
          external_invoice_no: data.external_invoice_no,
          invoice_date: data.invoice_date,
          invoice_value: data.invoice_value,
          invoice_paid_status: data.invoice_paid_status,
          invoice_url: data.invoice_url,
          invoice_paid_date: data.invoice_paid_date,
          invoice_paid_amount: data.invoice_paid_amount,
          status: 0,
          associated_user_id:data.associated_user_id,
        };
        var apiResponse = await createEmployeeInvoice(invoiceRequest)
        if (apiResponse.status === 201)
          {
            alert("Success");
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
                <h3 className="fw-bolder m-0">Submit Invoice</h3>
              </div>
            </div>
            <div className="card-body border-top p-9">
              <div className="row mb-6">
                <label className="col-lg-4 col-form-label fw-bold fs-6">
                  <span className="required">Contract Id</span>
                </label>
                <div className="col-lg-8 fv-row">
                  <select
                    id="contract_id"
                    className="form-select form-select-solid form-select-lg fw-bold"
                    {...formik.getFieldProps("contract_id")}
                    
                    onChange={async (e) => {
                      await handleUserChange(e.target.value);
                      formik.setFieldValue("client_id", updatedUserInfo.client_id);
                    
                    }}
                    value={initialValues.contract_id}
                  > 
                    <option value="">Select ID</option>
                    {allUserInfo.map((data: any, i: number) => (
                      <option key={i} value={data.contract_id}>
                        {data.firstName} {data.contract_id}
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
                      InternalInvoiceNo
                    </label>
                    <div className="col-lg-8 fv-row">
                      <input
                        type="text"
                        className="form-control form-control-lg form-control-solid"
                        placeholder="Internal Invoice Number"
                        {...formik.getFieldProps("internal_invoice_no")}
                        onChange={(value) => {
                          updateData({ internal_invoice_no: value.target.value});
                          formik.setFieldValue("internal_invoice_no",value.target.value)
                        }}
                      />
                      {formik.touched.internal_invoice_no && formik.errors.internal_invoice_no && (
                        <div className="fv-plugins-message-container">
                          <div className="fv-help-block">
                            
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="row mb-6">
                    <label className="col-lg-4 col-form-label required fw-bold fs-6">
                      ExternalInvoiceNo
                    </label>
                    <div className="col-lg-8 fv-row">
                    
                      <input
                      type="text"
                      className="form-control form-control-lg form-control-solid"
                      placeholder="Enter Invoice Number Starting From ITC.."
                      
                      onChange={(value) => {
                        updateData({ external_invoice_no: value.target.value });
                        formik.setFieldValue("external_invoice_no",value.target.value)
                        }}
                      > 
                      </input>
                    </div>
                  </div>
                  <div className="row mb-6">
                    <label className="col-lg-4 col-form-label fw-bold fs-6">
                      <span className="required">Invoice Date</span>
                    </label>
                    <div className="col-lg-8 fv-row">
                    <Flatpickr
                        className="form-control form-control-lg form-control-solid"
                        options={{
                          mode: "single",
                          dateFormat: "d-m-Y",
                        }}
                        onChange={(dateStr) => {
                          updateData({ invoice_date: dateStr.toLocaleString("en-IN",{
                            year: "numeric",
                            month: "2-digit",
                            day : "2-digit"
                            }).replace(/\//g, "-") });
                        }}
                      ></Flatpickr>
                      {formik.touched.invoice_date && formik.errors.invoice_date && (
                        <div className="fv-plugins-message-container">
                          <div className="fv-help-block">
                            {formik.errors.invoice_date}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="row mb-6">
                    <label className="col-lg-4 col-form-label required fw-bold fs-6">
                      InvoiceValue
                    </label>
                    <div className="col-lg-8 fv-row">
                    
                      <input
                      type="text"
                      className="form-control form-control-lg form-control-solid"
                      placeholder="Enter Invoice Value"
                      
                      onChange={(value) => {
                        updateData({ invoice_value: value.target.value });
                        formik.setFieldValue("invoice_value",value.target.value)
                        }}
                      >
                      </input>
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

export { EmployeeInvoice };
