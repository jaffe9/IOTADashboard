import { useState, FC } from "react";
import {
  IProfileDetailsSalary,
  profileDetailsSalaryInitialValues as initialValues,
} from "../../modules/accounts/components/settings/SettingsModel";
import * as Yup from "yup";
import { useFormik } from "formik";
import Flatpickr from "react-flatpickr";
import { apiHelper, updateSalaryIncrement } from "../../../apiFactory/apiHelper";
import {
  Salary,
} from "../../modules/apps/user-management/users-list/core/_models";
import { Value } from "sass";





var allUserInfo: any = await apiHelper.getEmpForSalaryIncrement().then(async (data) => {
  return data.data;
});

let updatedUserInfo: IProfileDetailsSalary = initialValues;


const UpdateSalary: FC = () => {
  const [data, setData] = useState<IProfileDetailsSalary>(updatedUserInfo);
  const updateData = (fieldsToUpdate: Partial<IProfileDetailsSalary>): void => {
    const updatedData = Object.assign(updatedUserInfo, fieldsToUpdate);
    setData(updatedData);
  };


  const handleUserChange = async (id: number) => {
    var hasMatch = allUserInfo.find(function (value: Salary) {
      return value.id == id;
    });
    updateData({
       id : id,
       pay_period: hasMatch.pay_period,
       pay_date : hasMatch.pay_date,
       basic_allowance : hasMatch.basic_allowance,
       hr_allowance : hasMatch.hr_allowance, 
       end_of_service_allowance : hasMatch.end_of_service_allowance, 
       travel_other_allowance : hasMatch.travel_other_allowance, 
       earnings_total : hasMatch.earnings_total, 
       lop_days : hasMatch.lop_days, 
       employee_request : hasMatch.employee_request, 
       salary_advance : hasMatch.salary_advance, 
       lop_salary_total : hasMatch.lop_salary_total, 
       total_net_salary :  hasMatch.total_net_salary,
       total_net_salary_words : hasMatch.total_net_salary_words, 
       salary_pay_mode : hasMatch.salary_pay_mode, 
       working_days : hasMatch.working_days, 
       holidays : hasMatch.holidays,
       deductions_total : hasMatch.deductions_total,
    });
  };

  const [loading, setLoading] = useState(false);
  const formik = useFormik<IProfileDetailsSalary>({
    initialValues,
    onSubmit:async () => {
      setLoading(true);
      setTimeout(async () => {
        const updatedData = Object.assign(data, updatedUserInfo);
        setData(updatedData);
        if( data.working_days.length < 1  )
        {
          alert("Please select all fields")
          setLoading(false)
          return
        }
        const salary : Salary = {
           id : data.id,
           pay_period: data.pay_period,
           pay_date: data.pay_date,
           basic_allowance : data.basic_allowance,
           hr_allowance : data.hr_allowance,
           end_of_service_allowance : data.end_of_service_allowance,
           travel_other_allowance : data.travel_other_allowance,
           earnings_total : data.earnings_total,
           lop_days : data.lop_days,
           employee_request : data.employee_request,
           salary_advance : data.salary_advance,
           lop_salary_total : data.lop_salary_total,
           total_net_salary : data.total_net_salary,
           total_net_salary_words : data.total_net_salary_words,
           salary_pay_mode : data.salary_pay_mode,
           working_days : data.working_days,
           holidays : data.holidays,
           deductions_total : data.deductions_total,
        };
        console.log("updated salary  response:" , salary)
        const apiResponse = await updateSalaryIncrement(salary)
      
        if (apiResponse.status === 204)
          {
            alert("Salary Updated Successfully  Successful");
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
                <h3 className="fw-bolder m-0">Update Salary</h3>
              </div>
            </div>
            <div className="card-body border-top p-9">
              <div className="row mb-6">
                <label className="col-lg-4 col-form-label fw-bold fs-6">
                  <span className="required">Employee Name</span>
                </label>
                <div className="col-lg-8 fv-row">
                <select
                      id="companyName"
                      className="form-select form-select-solid form-select-lg fw-bold"
                   //   {...formik.getFieldProps("username")}
                      
                      onChange={async (value) => {
                        await handleUserChange(parseInt(value.target.value));
                        formik.setFieldValue("user_id.username",updatedUserInfo.user_id.username)
                      }}
                    //  value={initialValues.user_id}
                    > 
                      <option value="">Select Employee </option>
                      {allUserInfo.map((data: any, i: number) => (
                        <option key={i} value={data.id} hidden={data.isDisabled == true}>
                          {data.user_id.username} 
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
                      Pay Period
                    </label>
                    
                    <div className="col-lg-8 fv-row">
                    <Flatpickr
                          className="form-control form-control-lg form-control-solid"
                          placeholder="Click To Select Date"
                          options={{
                           }}
                          onChange={(dateStr) => {
                          updateData({ pay_period: dateStr.toLocaleString("en",{
                            year: "numeric",
                            month: "short",
                            }).replace(/\//g, "") });
                        }}
                      ></Flatpickr>   
                      {formik.touched.pay_period && formik.errors.pay_period && (
                        <div className="fv-plugins-message-container">
                          <div className="fv-help-block">
                            {formik.errors.pay_period}
                          </div>
                        </div>
                      )}
                    </div> 
                  </div>

                  <div className="row mb-6">
                    <label className="col-lg-4 col-form-label required fw-bold fs-6">
                      Pay Date
                    </label>
                    
                    <div className="col-lg-8 fv-row">
                     <Flatpickr
                          className="form-control form-control-lg form-control-solid"
                          placeholder="Click To Select Date"
                          options={{
                          mode: "single",
                          dateFormat: "d-m-Y",
                           }}
                          onChange={(dateStr) => {
                          updateData({ pay_date: dateStr.toLocaleString("en",{
                            year: "numeric",
                            month: "2-digit",
                            day : "2-digit"
                            }).replace(/\//g, "-") });
                        }}
                        
                      ></Flatpickr>                   
                      {formik.touched.pay_date && formik.errors.pay_date && (
                        <div className="fv-plugins-message-container">
                          <div className="fv-help-block">
                            {formik.errors.pay_date}
                          </div>
                        </div>
                      )}
                    </div> 
                  </div>

                  <div className="row mb-6">
                    <label className="col-lg-4 col-form-label  fw-bold fs-6">
                     Loss Of Pay Days
                    </label>
                    
                    <div className="col-lg-8 fv-row">
                    <input
                        type="text"
                        className="form-control form-control-lg form-control-solid"
                        placeholder="Enter Loss Of Pay Days"
                       {...formik.getFieldProps("lop_days")}
                        onChange={(value) => {
                          updateData({ lop_days: value.target.value });
                          formik.setFieldValue("lop_days",updatedUserInfo.lop_days)
                        }}
                      />
                      {formik.touched.lop_days && formik.errors.lop_days && (
                        <div className="fv-plugins-message-container">
                          <div className="fv-help-block">
                            {formik.errors.lop_days}
                          </div>
                        </div>
                      )}
                    </div> 
                  </div>

                <div className="row mb-6">
                    <label className="col-lg-4 col-form-label  fw-bold fs-6">
                      Basic Allowance
                    </label>

                    <div className="col-lg-8 fv-row">
                    <input
                        type="text"
                        className="form-control form-control-lg form-control-solid"
                        placeholder="Enter Basic Allowance"
                        {...formik.getFieldProps("basic_allowance")}
                        onChange={(value) => {
                          updateData({ basic_allowance: value.target.value });
                          formik.setFieldValue("basic_allowance",updatedUserInfo.basic_allowance)
                          
                        }}
                      />
                      {formik.touched.basic_allowance && formik.errors.basic_allowance && (
                        <div className="fv-plugins-message-container">
                          <div className="fv-help-block">
                            {formik.errors.basic_allowance}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="row mb-6">
                    <label className="col-lg-4 col-form-label fw-bold fs-6">
                      HR Allowance
                    </label>

                    <div className="col-lg-8 fv-row">
                    <input
                        type="text"
                        className="form-control form-control-lg form-control-solid"
                        placeholder="Enter House Rent Allowance"
                        {...formik.getFieldProps("hr_allowance")}
                        onChange={(value) => {
                          updateData({ hr_allowance: value.target.value });
                          formik.setFieldValue("hr_allowance",updatedUserInfo.hr_allowance)
                        }}
                      />
                      {formik.touched.hr_allowance && formik.errors.hr_allowance && (
                        <div className="fv-plugins-message-container">
                          <div className="fv-help-block">
                            {formik.errors.hr_allowance}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  

                  <div className="row mb-6">
                    <label className="col-lg-4 col-form-label  fw-bold fs-6">
                      Travel And Other Allowance
                    </label>

                    <div className="col-lg-8 fv-row">
                    <input
                        type="text"
                        className="form-control form-control-lg form-control-solid"
                        placeholder="Enter Travel And Other Allowance"
                        {...formik.getFieldProps("travel_other_allowance")}
                        onChange={(value) => {
                          updateData({ travel_other_allowance: value.target.value });
                          formik.setFieldValue("travel_other_allowance",updatedUserInfo.travel_other_allowance)
                        }}
                      />
                      {formik.touched.travel_other_allowance && formik.errors.travel_other_allowance && (
                        <div className="fv-plugins-message-container">
                          <div className="fv-help-block">
                            {formik.errors.travel_other_allowance}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="row mb-6">
                    <label className="col-lg-4 col-form-label  fw-bold fs-6">
                      End Of Service Allowance
                    </label>
                    
                    <div className="col-lg-8 fv-row">
                    <input
                        type="text"
                        className="form-control form-control-lg form-control-solid"
                        placeholder="Enter End Of Service Allowance"
                       {...formik.getFieldProps("end_of_service_allowance")}
                        onChange={(value) => {
                          updateData({ end_of_service_allowance: value.target.value });
                          formik.setFieldValue("end_of_service_allowance",updatedUserInfo.end_of_service_allowance)
                        }}
                      />
                      {formik.touched.end_of_service_allowance && formik.errors.end_of_service_allowance && (
                        <div className="fv-plugins-message-container">
                          <div className="fv-help-block">
                            {formik.errors.end_of_service_allowance}
                          </div>
                        </div>
                      )}
                    </div> 
                  </div>
                  
                  <div className="row mb-6">
                    <label className="col-lg-4 col-form-label  fw-bold fs-6">
                      Salary Advance
                    </label>
                    
                    <div className="col-lg-8 fv-row">
                    <input
                        type="text"
                        className="form-control form-control-lg form-control-solid"
                        placeholder="Enter Salary Advance"
                       {...formik.getFieldProps("salary_advance")}
                        onChange={(value) => {
                          updateData({ salary_advance: value.target.value });
                          formik.setFieldValue("salary_advance",updatedUserInfo.salary_advance)
                        }}
                      />
                      {formik.touched.salary_advance && formik.errors.salary_advance && (
                        <div className="fv-plugins-message-container">
                          <div className="fv-help-block">
                            {formik.errors.salary_advance}
                          </div>
                        </div>
                      )}
                    </div> 
                  </div>
                    
                  <div className="row mb-6">
                    <label className="col-lg-4 col-form-label  fw-bold fs-6">
                      Employee Request 
                    </label>
                    
                    <div className="col-lg-8 fv-row">
                    <input
                        type="text"
                        className="form-control form-control-lg form-control-solid"
                        placeholder="Enter Employee Request Amount"
                       {...formik.getFieldProps("employee_request")}
                        onChange={(value) => {
                          updateData({ employee_request: value.target.value });
                          formik.setFieldValue("employee_request",updatedUserInfo.employee_request)
                        }}
                      />
                      {formik.touched.employee_request && formik.errors.employee_request && (
                        <div className="fv-plugins-message-container">
                          <div className="fv-help-block">
                            {formik.errors.employee_request}
                          </div>
                        </div>
                      )}
                    </div> 
                  </div>
                  
                  <div className="row mb-6">
                    <label className="col-lg-4 col-form-label  fw-bold fs-6">
                      Holidays 
                    </label>
                    
                    <div className="col-lg-8 fv-row">
                    <input
                        type="text"
                        className="form-control form-control-lg form-control-solid"
                        placeholder="Enter Holidays"
                       {...formik.getFieldProps("holidays")}
                        onChange={(value) => {
                          updateData({ holidays: value.target.value });
                          formik.setFieldValue("holidays",updatedUserInfo.holidays)
                        }}
                      />
                      {formik.touched.holidays && formik.errors.holidays && (
                        <div className="fv-plugins-message-container">
                          <div className="fv-help-block">
                            {formik.errors.holidays}
                          </div>
                        </div>
                      )}
                    </div> 
                  </div>
                  
                  <div className="row mb-6">
                    <label className="col-lg-4 col-form-label  fw-bold fs-6">
                      Working Days
                    </label>
                    
                    <div className="col-lg-8 fv-row">
                    <input
                        type="text"
                        className="form-control form-control-lg form-control-solid"
                        placeholder="Enter Working Days"
                       {...formik.getFieldProps("working_days")}
                        onChange={(value) => {
                          updateData({ working_days: value.target.value });
                          formik.setFieldValue("working_days",updatedUserInfo.working_days);
                        }}
                      />
                      {formik.touched.working_days && formik.errors.working_days && (
                        <div className="fv-plugins-message-container">
                          <div className="fv-help-block">
                            {formik.errors.working_days}
                          </div>
                        </div>
                      )}
                    </div> 
                  </div>
                   
                  <div className="row mb-6">
                    <label className="col-lg-4 col-form-label  fw-bold fs-6">
                      Loss Of Pay Total
                    </label>
                    
                    <div className="col-lg-8 fv-row">
                    <input
                        type="text"
                        className="form-control form-control-lg form-control-solid"
                        placeholder="Enter Total Loss Of Pay"
                       {...formik.getFieldProps("lop_salary_total")}
                        onChange={(value) => {
                          updateData({ lop_salary_total: value.target.value });
                          formik.setFieldValue("lop_salary_total",updatedUserInfo.lop_salary_total)
                        }}
                      />
                      {formik.touched.lop_salary_total && formik.errors.lop_salary_total && (
                        <div className="fv-plugins-message-container">
                          <div className="fv-help-block">
                            {formik.errors.lop_salary_total}
                          </div>
                        </div>
                      )}
                    </div> 
                  </div>

                  <div className="row mb-6">
                    <label className="col-lg-4 col-form-label  fw-bold fs-6">
                      Earnings Total
                    </label>

                    <div className="col-lg-8 fv-row">
                    <input
                        type="text"
                        className="form-control form-control-lg form-control-solid"
                        placeholder="Enter Earnings Total"
                        {...formik.getFieldProps("earnings_total")}
                        onChange={(value) => {
                          updateData({ earnings_total: value.target.value });
                          formik.setFieldValue("earnings_total",updatedUserInfo.earnings_total)
                          
                        }}
                      />
                      {formik.touched.earnings_total && formik.errors.earnings_total && (
                        <div className="fv-plugins-message-container">
                          <div className="fv-help-block">
                            {formik.errors.earnings_total}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
               
                  
                  <div className="row mb-6">
                    <label className="col-lg-4 col-form-label  fw-bold fs-6">
                      Deductions Total
                    </label>
                    
                    <div className="col-lg-8 fv-row">
                    <input
                        type="text"
                        className="form-control form-control-lg form-control-solid"
                        placeholder="Enter Deductions Total"
                       {...formik.getFieldProps("deductions_total")}
                        onChange={(value) => {
                          updateData({ deductions_total: value.target.value });
                          formik.setFieldValue("deductions_total",updatedUserInfo.deductions_total)
                        }}
                      />
                      {formik.touched.deductions_total && formik.errors.deductions_total && (
                        <div className="fv-plugins-message-container">
                          <div className="fv-help-block">
                            {formik.errors.deductions_total}
                          </div>
                        </div>
                      )}
                    </div> 
                  </div>

                  <div className="row mb-6">
                    <label className="col-lg-4 col-form-label  fw-bold fs-6">
                      Total Net Salary
                    </label>
                    
                    <div className="col-lg-8 fv-row">
                    <input
                        type="text"
                        className="form-control form-control-lg form-control-solid"
                        placeholder="Enter Total Net Salary"
                       {...formik.getFieldProps("total_net_salary")}
                        onChange={(value) => {
                          updateData({ total_net_salary: value.target.value });
                          formik.setFieldValue("total_net_salary",updatedUserInfo.total_net_salary)
                        }}
                      />
                      {formik.touched.total_net_salary && formik.errors.total_net_salary && (
                        <div className="fv-plugins-message-container">
                          <div className="fv-help-block">
                            {formik.errors.total_net_salary}
                          </div>
                        </div>
                      )}
                    </div> 
                  </div>
                 
                  <div className="row mb-6">
                    <label className="col-lg-4 col-form-label  fw-bold fs-6">
                      Net Salary In Words
                    </label>
                    
                    <div className="col-lg-8 fv-row">
                    <input
                        type="text"
                        className="form-control form-control-lg form-control-solid"
                        placeholder="Enter Net Salary In Words"
                       {...formik.getFieldProps("total_net_salary_words")}
                        onChange={(value) => {
                          updateData({ total_net_salary_words: value.target.value });
                          formik.setFieldValue("total_net_salary_words",updatedUserInfo.total_net_salary_words)
                        }}
                      />
                      {formik.touched.total_net_salary_words && formik.errors.total_net_salary_words && (
                        <div className="fv-plugins-message-container">
                          <div className="fv-help-block">
                            {formik.errors.total_net_salary_words}
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

export { UpdateSalary };