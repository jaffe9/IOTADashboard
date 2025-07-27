import React, { useState, useEffect, FC } from "react";
import { useFormik } from "formik";
import Flatpickr from "react-flatpickr";
import { Salary } from "../../modules/apps/user-management/users-list/core/_models";
import { apiHelper, updateSalaryIncrement } from "../../../apiFactory/apiHelper";
import { KTIcon, useDebounce } from "../../../_metronic/helpers";
import { MenuComponent } from "../../../_metronic/assets/ts/components";

const UpdateSalary: FC = () => {
  const [allUserInfo, setAllUserInfo] = useState<Salary[]>([]);
  const [filtered, setFiltered] = useState<Salary[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [editingRowId, setEditingRowId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  
  // Debounce search term
  const debouncedSearchTerm = useDebounce(searchTerm, 150);

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

  useEffect(() => {
    applyFilters();
  }, [debouncedSearchTerm, statusFilter, allUserInfo]);

  useEffect(() => {
    MenuComponent.reinitialization()
  }, []);

  const applyFilters = () => {
    let result = [...allUserInfo];

    if (debouncedSearchTerm && debouncedSearchTerm.trim()) {
      const term = debouncedSearchTerm.toLowerCase();
      result = result.filter(emp =>
        (emp.user_id?.username && emp.user_id.username.toLowerCase().includes(term)) ||
        (emp.pay_period && emp.pay_period.toLowerCase().includes(term)) ||
        (emp.total_net_salary_words && emp.total_net_salary_words.toLowerCase().includes(term))
      );
    }

    if (statusFilter) {
      // Add your status filtering logic here based on your data structure
      // Example: result = result.filter(emp => emp.status === statusFilter);
    }

    setFiltered(result);
  };

  const resetFilters = () => {
    setStatusFilter('');
    setSearchTerm('');
    setCurrentPage(1);
  };

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

  const currentData = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  // Create empty rows to maintain consistent table height
  const emptyRowsCount = itemsPerPage - currentData.length;
  const emptyRows = Array(emptyRowsCount).fill(null);

  return (
    <div className="card">
      {/* Card Header */}
      <div className="card-header border-0 pt-5">
        <h3 className="card-title align-items-start flex-column">
          <span className="card-label fw-bold fs-3 mb-1">Update Salary</span>
          <span className="text-muted mt-1 fw-semibold fs-7">Manage employee salary information</span>
        </h3>
        <div className="card-toolbar">
          <div className="d-flex gap-3 align-items-center">
                        {/* Search Component */}
            <div className="card-title">
              <div className="d-flex align-items-center position-relative my-1">
                <KTIcon iconName="magnifier" className="fs-1 position-absolute ms-6" />
                <input
                  type="text"
                  data-kt-salary-table-filter="search"
                  className="form-control form-control-solid w-450px ps-14"
                  placeholder="Search employees"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Filter Button */}
            <button
              type="button"
              className="btn btn-light-primary me-3"
              data-kt-menu-trigger="click"
              data-kt-menu-placement="bottom-end"
            >
              <KTIcon iconName="filter" className="fs-2" />
              Filter
            </button>
            
            {/* Filter SubMenu */}
            <div className="menu menu-sub menu-sub-dropdown w-300px w-md-325px" data-kt-menu="true">
              {/* Header */}
              <div className="px-7 py-5">
                <div className="fs-5 text-gray-900 fw-bolder">Filter Options</div>
              </div>
              
              {/* Separator */}
              <div className="separator border-gray-200"></div>
              
              {/* Content */}
              <div className="px-7 py-5" data-kt-salary-table-filter="form">
                {/* Status Filter */}
                <div className="mb-10">
                  <label className="form-label fs-6 fw-bold">Status:</label>
                  <select
                    className="form-select form-select-solid fw-bolder"
                    data-kt-select2="true"
                    data-placeholder="Select status"
                    data-allow-clear="true"
                    data-kt-salary-table-filter="status"
                    data-hide-search="true"
                    onChange={(e) => setStatusFilter(e.target.value)}
                    value={statusFilter}
                  >
                    <option value=""></option>
                    <option value="processed">Processed</option>
                    <option value="pending">Pending</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
                
                {/* Actions */}
                <div className="d-flex justify-content-end">
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="btn btn-light btn-active-light-primary fw-bold me-2 px-6"
                    data-kt-menu-dismiss="true"
                    data-kt-salary-table-filter="reset"
                  >
                    Reset
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentPage(1)}
                    className="btn btn-primary fw-bold px-6"
                    data-kt-menu-dismiss="true"
                    data-kt-salary-table-filter="filter"
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="card-body py-3">
        <div className="table-responsive" style={{minHeight: '500px'}}>
          {filtered.length > 0 ? (
            <table className="table table-row-dashed table-row-gray-200 align-middle gs-0 gy-4 border border-y border-white">
              <thead className="text-gray-900 fw-bold mb-1 fs-4">
                <tr className="border border-grey border-2">
                  <th className="px-3 min-w-120px">Name</th>
                  <th className="px-3 min-w-100px">Pay Period</th>
                  <th className="px-3 min-w-100px">Pay Date</th>
                  <th className="px-3 min-w-100px">Basic Allowance</th>
                  <th className="px-3 min-w-100px">HR Allowance</th>
                  <th className="px-3 min-w-100px">Travel Allowance</th>
                  <th className="px-3 min-w-100px">Salary Advance</th>
                  <th className="px-3 min-w-80px">OverTime</th>
                  <th className="px-3 min-w-100px">Employee Request</th>
                  <th className="px-3 min-w-80px">Working Days</th>
                  <th className="px-3 min-w-80px">Holidays</th>
                  <th className="px-3 min-w-80px">Leaves</th>
                  <th className="px-3 min-w-100px">Loss Of Pay</th>
                  <th className="px-3 min-w-100px">Earnings Total</th>
                  <th className="px-3 min-w-100px">Deductions</th>
                  <th className="px-3 min-w-100px">Net Salary</th>
                  <th className="px-3 min-w-150px">Net Salary Words</th>
                  <th className="px-3 min-w-120px">Action</th>
                </tr>
              </thead>
              <tbody className="border border-grey border-2">
                {currentData.map(emp =>
                  editingRowId === emp.id ? (
                    <tr key={emp.id} className="bg-light-primary">
                      <td><span className="text-gray-900 fw-bold">{emp.user_id?.username || "N/A"}</span></td>
                      <td>
                        <Flatpickr
                          className="form-control form-control-sm"
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
                          className="form-control form-control-sm"
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
                          className="form-control form-control-sm"
                          value={formik.values.basic_allowance}
                          onChange={formik.handleChange}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          name="hr_allowance"
                          className="form-control form-control-sm"
                          value={formik.values.hr_allowance}
                          onChange={formik.handleChange}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          name="travel_other_allowance"
                          className="form-control form-control-sm"
                          value={formik.values.travel_other_allowance}
                          onChange={formik.handleChange}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          name="salary_advance"
                          className="form-control form-control-sm"
                          value={formik.values.salary_advance}
                          onChange={formik.handleChange}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          name="overTime"
                          className="form-control form-control-sm"
                          value={formik.values.overTime}
                          onChange={formik.handleChange}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          name="employee_request"
                          className="form-control form-control-sm"
                          value={formik.values.employee_request}
                          onChange={formik.handleChange}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          name="working_days"
                          className="form-control form-control-sm"
                          value={formik.values.working_days}
                          onChange={formik.handleChange}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          name="holidays"
                          className="form-control form-control-sm"
                          value={formik.values.holidays}
                          onChange={formik.handleChange}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          name="leaves"
                          className="form-control form-control-sm"
                          value={formik.values.leaves}
                          onChange={formik.handleChange}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          name="lop_salary_total"
                          className="form-control form-control-sm"
                          value={formik.values.lop_salary_total}
                          onChange={formik.handleChange}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          name="earnings_total"
                          className="form-control form-control-sm"
                          value={formik.values.earnings_total}
                          onChange={formik.handleChange}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          name="deductions_total"
                          className="form-control form-control-sm"
                          value={formik.values.deductions_total}
                          onChange={formik.handleChange}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          name="total_net_salary"
                          className="form-control form-control-sm"
                          value={formik.values.total_net_salary}
                          onChange={formik.handleChange}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          name="total_net_salary_words"
                          className="form-control form-control-sm"
                          value={formik.values.total_net_salary_words}
                          onChange={formik.handleChange}
                        />
                      </td>
                      <td>
                        <form onSubmit={formik.handleSubmit}>
                          <div className="d-flex gap-1">
                            <button 
                              type="submit" 
                              className="badge badge-success" 
                              disabled={loading}
                              style={{border: 'none', cursor: 'pointer'}}
                            >
                              <strong>{loading ? "Saving..." : "Save"}</strong>
                            </button>
                            <button 
                              type="button" 
                              className="badge badge-secondary" 
                              onClick={cancelEdit}
                              style={{border: 'none', cursor: 'pointer'}}
                            >
                              <strong>Cancel</strong>
                            </button>
                          </div>
                        </form>
                      </td>
                    </tr>
                  ) : (
                    <tr key={emp.id}>
                      <td>
                        <a href="#" className="text-gray-900 fw-bold text-hover-primary mb-1 fs-6">
                          {emp.user_id?.username || "N/A"}
                        </a>
                      </td>
                      <td><span className="text-primary fw-bold">{emp.pay_period}</span></td>
                      <td><span className="text-gray-900 fw-semibold">{emp.pay_date}</span></td>
                      <td><span className="text-danger fw-bold">{formatNumber(emp.basic_allowance)}</span></td>
                      <td><span className="text-danger fw-bold">{formatNumber(emp.hr_allowance)}</span></td>
                      <td><span className="text-danger fw-bold">{formatNumber(emp.travel_other_allowance)}</span></td>
                      <td><span className="text-warning fw-bold">{formatNumber(emp.salary_advance)}</span></td>
                      <td><span className="text-success fw-bold">{formatNumber(emp.overTime)}</span></td>
                      <td><span className="text-muted fw-semibold">{emp.employee_request || "-"}</span></td>
                      <td><span className="text-gray-900 fw-semibold">{emp.working_days}</span></td>
                      <td><span className="text-gray-900 fw-semibold">{emp.holidays}</span></td>
                      <td><span className="text-gray-900 fw-semibold">{emp.leaves}</span></td>
                      <td><span className="text-danger fw-bold">{formatNumber(emp.lop_salary_total)}</span></td>
                      <td><span className="text-success fw-bold">{formatNumber(emp.earnings_total)}</span></td>
                      <td><span className="text-danger fw-bold">{formatNumber(emp.deductions_total)}</span></td>
                      <td><span className="text-success fw-bold">{formatNumber(emp.total_net_salary)}</span></td>
                      <td>
                        <span className="text-muted fw-semibold d-block" style={{
                          display: 'inline-block',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          maxWidth: '150px'
                        }} title={emp.total_net_salary_words}>
                          {emp.total_net_salary_words}
                        </span>
                      </td>
                      <td>
                        <button
                          type="button"
                          className="badge badge-primary"
                          onClick={() => startEditing(normalizeSalary(emp))}
                          style={{border: 'none', cursor: 'pointer'}}
                        >
                          <strong>Edit</strong>
                        </button>
                      </td>
                    </tr>
                  )
                )}
                
                {/* Empty rows to maintain consistent table height */}
                {emptyRows.map((_, index) => (
                  <tr key={`empty-${index}`} style={{height: '45px'}}>
                    <td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td>
                    <td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td>
                    <td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td>
                    <td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-900 fw-bold text-hover-danger mb-1 fs-6 text-center">
              No employees found matching your criteria!
            </p>
          )}
        </div>

        {/* Pagination */}
        <div className="d-flex justify-content-between align-items-center mt-4">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(p => p - 1)}
            className="btn btn-sm btn-light-primary"
          >
            Previous
          </button>
          <span className="text-gray-700 fw-semibold">
            Page {currentPage} of {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(p => p + 1)}
            className="btn btn-sm btn-light-primary"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export { UpdateSalary };