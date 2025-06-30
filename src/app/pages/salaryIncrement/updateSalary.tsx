import React, { useState, useEffect, FC } from "react";
import { useFormik } from "formik";
import Flatpickr from "react-flatpickr";
import { Salary } from "../../modules/apps/user-management/users-list/core/_models";
import { apiHelper, updateSalaryIncrement } from "../../../apiFactory/apiHelper";

const UpdateSalary: FC = () => {
  const [allUserInfo, setAllUserInfo] = useState<Salary[]>([]);
  const [editingRowId, setEditingRowId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await apiHelper.getEmpForSalaryIncrement();
        setAllUserInfo(data ?? []);
      } catch (error) {
        console.error("Failed to fetch employees", error);
      }
    }
    fetchData();
  }, []);

  const toNumberStrict = (val: any): number => {
    if (val === "" || val === undefined || val === null) return 0;
    const num = Number(val);
    return isNaN(num) ? 0 : num;
  };

  const normalizeSalary = (salary: Partial<Salary>): Salary => ({
    id: toNumberStrict(salary.id),
    pay_period: salary.pay_period ?? "",
    pay_date: salary.pay_date ?? "",
    basic_allowance: salary.basic_allowance ?? "",
    hr_allowance: salary.hr_allowance ?? "",
    end_of_service_allowance: salary.end_of_service_allowance ?? "",
    travel_other_allowance: salary.travel_other_allowance ?? "",
    earnings_total: salary.earnings_total ?? "",
    lop_days: salary.lop_days ?? "",
    employee_request: salary.employee_request ?? "",
    salary_advance: salary.salary_advance ?? "",
    lop_salary_total: salary.lop_salary_total ?? "",
    total_net_salary: salary.total_net_salary ?? "",
    total_net_salary_words: salary.total_net_salary_words ?? "",
    salary_pay_mode: salary.salary_pay_mode ?? "",
    working_days: salary.working_days ?? "",
    holidays: salary.holidays ?? "",
    deductions_total: salary.deductions_total ?? "",
    leaves: salary.leaves ?? "",
    overTime: salary.overTime ?? "",
    payslilpOptionSelected: salary.payslilpOptionSelected ?? undefined,
    user_id: salary.user_id ?? { username: "", email: "" },
  });

  const formik = useFormik<Salary>({
    enableReinitialize: true,
    initialValues: normalizeSalary({}),
    onSubmit: async (values) => {
      setLoading(true);
      const sanitizedValues = {
        ...values,
        id: toNumberStrict(values.id),
        user_id: toNumberStrict(values.user_id?.username),
        basic_allowance: toNumberStrict(values.basic_allowance),
        hr_allowance: toNumberStrict(values.hr_allowance),
        end_of_service_allowance: toNumberStrict(values.end_of_service_allowance),
        travel_other_allowance: toNumberStrict(values.travel_other_allowance),
        earnings_total: toNumberStrict(values.earnings_total),
        lop_days: toNumberStrict(values.lop_days),
        employee_request: toNumberStrict(values.employee_request),
        salary_advance: toNumberStrict(values.salary_advance),
        lop_salary_total: toNumberStrict(values.lop_salary_total),
        total_net_salary: toNumberStrict(values.total_net_salary),
        working_days: toNumberStrict(values.working_days),
        holidays: toNumberStrict(values.holidays),
        deductions_total: toNumberStrict(values.deductions_total),
        leaves: toNumberStrict(values.leaves),
        overTime: toNumberStrict(values.overTime),
      };

      try {
        const response = await updateSalaryIncrement(sanitizedValues as any);
        if (response.status === 204) {
          alert("Salary Updated Successfully");
          setEditingRowId(null);
          const updatedList = allUserInfo.map(emp =>
            emp.id === values.id ? { ...values } : emp
          );
          setAllUserInfo(updatedList);
        } else {
          alert("Update failed");
        }
      } catch (error) {
        alert("API call failed");
        console.error("update error:", error);
      }
      setLoading(false);
    }
  });

  const startEditing = (salary: Salary) => {
    formik.setValues(salary);
    setEditingRowId(salary.id ?? null);
  };

  const cancelEdit = () => {
    setEditingRowId(null);
  };
  
const formatNumber = (val: string | number | undefined) =>
  val && !isNaN(Number(val))
    ? Number(val).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    : "-";

  return (
    <div className="card mb-12">
      <div className="card-body">
        <h3 className="fw-bolder mb-4">Update Salary</h3>
        <table className="table table-bordered table-hover">
          <thead>
            <tr>
              <th>Name</th>
              <th>Pay_Period</th>
              <th>Pay_Date</th>
              <th>Basic Allowance</th>
              <th>HR Allowance</th>
              {/* <th>End of Service Allowance</th> This is for deploymet check Monday */}
              <th>Travel Allowance</th>
              <th>Salary Advance</th>
              <th>OverTime</th>
              <th>Employee_Request</th>
              <th>Working Days</th>
              <th>Holidays</th>
              <th>Leaves</th>
              <th>Loss_Of_Pay</th>
              <th>Earnings_Total</th>
              <th>Deductions</th>
              <th>Net_Salary</th>
              <th>Net_Salary_Words</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {allUserInfo.length ? (
              allUserInfo.map((emp) =>
                editingRowId === emp.id ? (
                  <tr key={emp.id} style={{ backgroundColor: "#f0f3f5" }}>
                    <td>{emp.user_id?.username || "N/A"}</td>
                    <td>
                      <Flatpickr
                        className="form-control"
                        value={formik.values.pay_period}
                        onChange={(dates) => {
                          formik.setFieldValue(
                            "pay_period",
                            dates[0]
                              ? dates[0].toLocaleString("en", {
                                  year: "numeric",
                                  month: "short",
                                })
                              : ""
                          );
                        }}
                      />
                    </td>
                    <td>
                      <Flatpickr
                        className="form-control"
                        value={formik.values.pay_date}
                        onChange={(dates) => {
                          formik.setFieldValue(
                            "pay_date",
                            dates[0]
                              ? dates[0].toLocaleDateString("en").replace(/\//g, "-")
                              : ""
                          );
                        }}
                        options={{ mode: "single", dateFormat: "d-m-Y" }}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        name="basic_allowance"
                        className="form-control"
                        value={formik.values.basic_allowance}
                        onChange={formik.handleChange}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        name="hr_allowance"
                        className="form-control"
                        value={formik.values.hr_allowance}
                        onChange={formik.handleChange}
                      />
                    </td>
                    {/* <td>
                      <input
                        type="text"
                        name="end_of_service_allowance"
                        className="form-control"
                        value={formik.values.end_of_service_allowance}
                        onChange={formik.handleChange}
                      />
                    </td> */}
                    <td>
                      <input
                        type="text"
                        name="travel_other_allowance"
                        className="form-control"
                        value={formik.values.travel_other_allowance}
                        onChange={formik.handleChange}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        name="salary_advance"
                        className="form-control"
                        value={formik.values.salary_advance}
                        onChange={formik.handleChange}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        name="overTime"
                        className="form-control"
                        value={formik.values.overTime}
                        onChange={formik.handleChange}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        name="employee_request"
                        className="form-control"
                        value={formik.values.employee_request}
                        onChange={formik.handleChange}
                      />
                    </td>
                      <td>
                      <input
                        type="text"
                        name="working_days"
                        className="form-control"
                        value={formik.values.working_days}
                        onChange={formik.handleChange}
                      />
                    </td>
                      <td>
                      <input
                        type="text"
                        name="holidays"
                        className="form-control"
                        value={formik.values.holidays}
                        onChange={formik.handleChange}
                      />
                    </td>
                      <td>
                      <input
                        type="text"
                        name="leaves"
                        className="form-control"
                        value={formik.values.leaves}
                        onChange={formik.handleChange}
                      />
                    </td>
                      <td>
                      <input
                        type="text"
                        name="lop_salary_total"
                        className="form-control"
                        value={formik.values.lop_salary_total}
                        onChange={formik.handleChange}
                      />
                    </td>
                      <td>
                      <input
                        type="text"
                        name="earnings_total"
                        className="form-control"
                        value={formik.values.earnings_total}
                        onChange={formik.handleChange}
                      />
                    </td>
                      <td>
                      <input
                        type="text"
                        name="deductions_total"
                        className="form-control"
                        value={formik.values.deductions_total}
                        onChange={formik.handleChange}
                      />
                    </td>
                      <td>
                      <input
                        type="text"
                        name="total_net_salary"
                        className="form-control"
                        value={formik.values.total_net_salary}
                        onChange={formik.handleChange}
                      />
                    </td>
                      <td>
                      <input
                        type="text"
                        name="total_net_salary_words"
                        className="form-control"
                        value={formik.values.total_net_salary_words}
                        onChange={formik.handleChange}
                      />
                    </td>
                    <td>
                      <form onSubmit={formik.handleSubmit}>
                        <button type="submit" className="btn btn-success btn-sm me-2" disabled={loading}>
                          {loading ? "Saving..." : "Save"}
                        </button>
                        <button type="button" className="btn btn-secondary btn-sm" onClick={cancelEdit}>
                          Cancel
                        </button>
                      </form>
                    </td>
                  </tr>
                ) : (
                  <tr key={emp.id}>
                    <td>{emp.user_id?.username || "N/A"}</td>
                    <td>{emp.pay_period || "-"}</td>
                    <td>{emp.pay_date || "-"}</td>
                    <td>{formatNumber(emp.basic_allowance)}</td>
                    <td>{formatNumber(emp.hr_allowance)}</td>
                    {/* <td>{emp.end_of_service_allowance || "-"}</td> */}
                    <td>{formatNumber(emp.travel_other_allowance)}</td>
                    <td>{formatNumber(emp.salary_advance)}</td>
                    <td>{formatNumber(emp.overTime)}</td>
                    <td>{emp.employee_request || "-"}</td>
                    <td>{emp.working_days || "-"}</td>
                    <td>{emp.holidays || "-"}</td>
                    <td>{emp.leaves || "-"}</td>
                    <td>{formatNumber(emp.lop_salary_total)}</td>
                    <td>{formatNumber(emp.earnings_total)}</td>
                    <td>{formatNumber(emp.deductions_total)}</td>
                    <td>{formatNumber(emp.total_net_salary)}</td>
                    <td>{emp.total_net_salary_words || "-"}</td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        onClick={() => startEditing(normalizeSalary(emp))}
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                )
              )
            ) : (
              <tr>
                <td colSpan={8}>Loading employees...</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export { UpdateSalary };
