import { useState, FC } from "react";
import {
  IProfileDetails,
  profileDetailsInitValues as initialValues,
} from "../../modules/accounts/components/settings/SettingsModel";
import * as Yup from "yup";
import { useFormik } from "formik";
import Flatpickr from "react-flatpickr";
import { apiHelper, createEmployeeTimesheet } from "../../../apiFactory/apiHelper";
import {
  User,
  TimesheetRequest
} from "../../modules/apps/user-management/users-list/core/_models";

var salaryDetailsInfo: any = await apiHelper
  .getEmployeeSalaryDetailInfo("1")
  .then(async (data) => {
    return data;
  });

var allUserInfo: any = await apiHelper.getAllEmployees().then(async (data) => {
  return data.data;
});
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

const EmployeeTimesheet: FC = () => {
  const [data, setData] = useState<IProfileDetails>(updatedUserInfo);
  const updateData = (fieldsToUpdate: Partial<IProfileDetails>): void => {
    const updatedData = Object.assign(updatedUserInfo, fieldsToUpdate);
    setData(updatedData);
  };
  const handleUserChange = async (userName: string) => {
    var hasMatch = allUserInfo.find(function (value: User) {
      return value.firstName == userName;
    });
    updateData({
      client: hasMatch.companyName,
      fName: userName,
      sEmployee: hasMatch.employeeId,
    });
  };

  const [loading, setLoading] = useState(false);
  const formik = useFormik<IProfileDetails>({
    initialValues,
    onSubmit: () => {
      setLoading(true);
      setTimeout(async () => {
        const payload = {
          ...updatedUserInfo,
        };
        const updatedData = Object.assign(data, updatedUserInfo);
        setData(updatedData);
        if(data.sEmployee.length < 1 || data.fName.length < 1 || data.client.length < 1 || data.dates.length < 1)
        {
          alert("Please select all fields")
          setLoading(false)
          return
        }
        let timeSheetRequest : TimesheetRequest = {
          employeeId: data.sEmployee,
          employeeName: data.fName,
          employeeClient: data.client,
          timesheetMonthYear: data.monthyear,
          workingDays: data.dates,
          workingDates: data.datesStr,
          holidayDays: data.holidays,
          holidayDates: data.holidaysStr,
          leaveDays: data.leaves,
          leaveDates: data.leavesStr,
          createdBy: "Jaffar",
          status: 0
        };
        var apiResponse = await createEmployeeTimesheet(timeSheetRequest)
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
                <h3 className="fw-bolder m-0">Submit Timesheet</h3>
              </div>
            </div>
            <div className="card-body border-top p-9">
              <div className="row mb-6">
                <label className="col-lg-4 col-form-label fw-bold fs-6">
                  <span className="required">Select Employee</span>
                </label>
                <div className="col-lg-8 fv-row">
                  <select
                    id="sEmployee"
                    className="form-select form-select-solid form-select-lg fw-bold"
                    {...formik.getFieldProps("sEmployee")}
                    defaultValue={"Select a Employee..."}
                    onChange={async (e) => {
                      await handleUserChange(e.target.value);
                      formik.setFieldValue("company", updatedUserInfo.client);
                    }}
                    value={initialValues.fName}
                  >
                    {allUserInfo.map((data: any, i: number) => (
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
              <form onSubmit={formik.handleSubmit} noValidate className="form">
                <div className="card-body border-top p-9">
                  <div className="row mb-6">
                    <label className="col-lg-4 col-form-label required fw-bold fs-6">
                      Client
                    </label>
                    <div className="col-lg-8 fv-row">
                      <input
                        type="text"
                        className="form-control form-control-lg form-control-solid"
                        placeholder="Company name"
                        {...formik.getFieldProps("company")}
                        onChange={(value) => {
                          updateData({ client: value.target.value });
                        }}
                      />
                      {formik.touched.client && formik.errors.client && (
                        <div className="fv-plugins-message-container">
                          <div className="fv-help-block">
                            {formik.errors.client}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="row mb-6">
                    <label className="col-lg-4 col-form-label required fw-bold fs-6">
                      Working Dates
                    </label>
                    <div className="col-lg-8 fv-row">
                      <Flatpickr
                        className="form-control form-control-lg form-control-solid"
                        options={
                          {
                            mode: "multiple",
                            dateFormat: "d-m-Y"
                          }
                      }
                        onChange={(dateStr) => {
                          updateData({ dates: dateStr.length.toString() });
                          updateData({ datesStr: dateStr.toString()});
                        }}
                      ></Flatpickr>
                      {formik.touched.dates && formik.errors.dates && (
                        <div className="fv-plugins-message-container">
                          <div className="fv-help-block">
                            {formik.errors.dates}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="row mb-6">
                    <label className="col-lg-4 col-form-label fw-bold fs-6">
                      <span className="required">Month & Year</span>
                    </label>
                    <div className="col-lg-8 fv-row">
                      <Flatpickr
                        className="form-control form-control-lg form-control-solid"
                        options={{
                          mode: "single",
                          defaultDate: new Date(),
                          dateFormat: "M-y",
                        }}
                        onChange={(dateStr) => {
                          updateData({
                            monthyear: new Date(dateStr.toString())
                              .toLocaleDateString("en-IN", {
                                year: "numeric",
                                month: "short",
                              })
                              .replace(/ /g, "-"),
                          });
                        }}
                      ></Flatpickr>
                      {formik.touched.monthyear && formik.errors.monthyear && (
                        <div className="fv-plugins-message-container">
                          <div className="fv-help-block">
                            {formik.errors.monthyear}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="row mb-6">
                    <label className="col-lg-4 col-form-label fw-bold fs-6">
                      <span className="required">Public Holidays</span>
                    </label>
                    <div className="col-lg-8 fv-row">
                      <Flatpickr
                        className="form-control form-control-lg form-control-solid"
                        options={{
                          mode: "multiple",
                          dateFormat: "d-m-Y",
                        }}
                        onChange={(dateStr) => {
                          updateData({ holidays: dateStr.length.toString() });
                          updateData({ holidaysStr: dateStr.toString()});
                        }}
                      ></Flatpickr>
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
                    <label className="col-lg-4 col-form-label required fw-bold fs-6">
                      Employee Leaves
                    </label>
                    <div className="col-lg-8 fv-row">
                      <Flatpickr
                        className="form-control form-control-lg form-control-solid"
                        options={{
                          mode: "multiple",
                          dateFormat: "d-m-Y",
                        }}
                        onChange={(dateStr) => {
                          updateData({ leaves: dateStr.length.toString() });
                          updateData({ leavesStr: dateStr.toString()});
                        }}
                      ></Flatpickr>
                      {formik.touched.leaves && formik.errors.leaves && (
                        <div className="fv-plugins-message-container">
                          <div className="fv-help-block">
                            {formik.errors.leaves}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="row mb-6">
                    <label className="col-lg-4 col-form-label fw-bold fs-6">
                      Communication
                    </label>

                    <div className="col-lg-8 fv-row">
                      <div className="d-flex align-items-center mt-3">
                        <label className="form-check form-check-inline form-check-solid me-5">
                          <input
                            className="form-check-input"
                            name="communication[]"
                            type="checkbox"
                            defaultChecked={data.communications?.email}
                            onChange={() => {
                              updateData({
                                communications: {
                                  email: !data.communications?.email,
                                  phone: data.communications?.phone,
                                },
                              });
                            }}
                          />
                          <span className="fw-bold ps-2 fs-6">Email</span>
                        </label>

                        <label className="form-check form-check-inline form-check-solid">
                          <input
                            className="form-check-input"
                            name="communication[]"
                            type="checkbox"
                            defaultChecked={data.communications?.phone}
                            onChange={() => {
                              updateData({
                                communications: {
                                  email: data.communications?.email,
                                  phone: !data.communications?.phone,
                                },
                              });
                            }}
                          />
                          <span className="fw-bold ps-2 fs-6">Phone</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card-footer d-flex justify-content-end py-6 px-9">
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

export { EmployeeTimesheet };
