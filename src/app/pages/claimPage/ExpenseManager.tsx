import { useEffect, useState } from "react";
import { getAllExpenses, updateExpense } from "../../../apiFactory/apiHelper";
import { Expense } from "../../modules/apps/user-management/users-list/core/_models";
import { KTIcon, useDebounce } from "../../../_metronic/helpers";
import { MenuComponent } from "../../../_metronic/assets/ts/components";

const ExpenseManager = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [filtered, setFiltered] = useState<Expense[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [editingRow, setEditingRow] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  
  // Debounce search term so that it only gives us latest value
  // if searchTerm has not been updated within last 150ms
  const debouncedSearchTerm = useDebounce(searchTerm, 150);

  useEffect(() => {
    loadExpenses();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [debouncedSearchTerm, typeFilter, statusFilter, expenses]);

  useEffect(() => {
    MenuComponent.reinitialization()
  }, []);

  const loadExpenses = async () => {
    const data = await getAllExpenses();
    setExpenses(data || []);
  };

  const applyFilters = () => {
    let result = [...expenses];

    if (debouncedSearchTerm && debouncedSearchTerm.trim()) {
      const term = debouncedSearchTerm.toLowerCase();
      result = result.filter(exp =>
        (exp.expenseBy && exp.expenseBy.toLowerCase().includes(term)) ||
        (exp.expenseType?.expenseTypeDesc && exp.expenseType.expenseTypeDesc.toLowerCase().includes(term)) ||
        (exp.associatedUserId?.fullName && exp.associatedUserId.fullName.toLowerCase().includes(term)) ||
        (exp.externalTransactionNarration && exp.externalTransactionNarration.toLowerCase().includes(term))
      );
    }

    if (typeFilter) {
      result = result.filter(exp => exp.expenseType?.expenseTypeDesc === typeFilter);
    }

    if (statusFilter) {
      if (statusFilter === 'approved') {
        result = result.filter(exp => exp.expenseApprovalStatus === true);
      } else if (statusFilter === 'pending') {
        result = result.filter(exp => exp.expenseApprovalStatus === false);
      }
      // Note: Add 'rejected' logic here if you have a rejected status field
    }

    setFiltered(result);
  };

  const resetFilters = () => {
    setStatusFilter('');
    setTypeFilter('');
    setSearchTerm('');
    setCurrentPage(1);
  };

  const applyStatusFilter = () => {
    setCurrentPage(1);
    applyFilters();
  };

  const handleEdit = (id: number) => setEditingRow(id);
  const handleCancel = () => setEditingRow(null);

  const handleSave = async (expense: Expense) => {
    const updated = await updateExpense(expense);
    if (updated.status === 204) {
      alert("Expense updated successfully.");
      await loadExpenses();
      setEditingRow(null);
    } else {
      alert("Failed to update.");
    }
  };

  const handleChange = (id: number, field: keyof Expense, value: any) => {
    setFiltered(prev =>
      prev.map(exp => (exp.id === id ? { ...exp, [field]: value } : exp))
    );
  };

  const currentData = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const uniqueTypes = [...new Set(expenses.map(e => e.expenseType?.expenseTypeDesc).filter(Boolean))];

  // Create empty rows to maintain consistent table height
  const emptyRowsCount = itemsPerPage - currentData.length;
  const emptyRows = Array(emptyRowsCount).fill(null);

  return (
    <div className="card">
      {/* Card Header */}
      <div className="card-header border-0 pt-5">
        <h3 className="card-title align-items-start flex-column">
          <span className="card-label fw-bold fs-3 mb-1">Expense Manager</span>
          <span className="text-muted mt-1 fw-semibold fs-7">Manage and track all expenses</span>
        </h3>
        <div className="card-toolbar">
          <div className="d-flex gap-3 align-items-center">
                        {/* Search Component */}
            <div className="card-title">
              <div className="d-flex align-items-center position-relative my-1">
                <KTIcon iconName="magnifier" className="fs-1 position-absolute ms-6" />
                <input
                  type="text"
                  data-kt-expense-table-filter="search"
                  className="form-control form-control-solid w-450px ps-14"
                  placeholder="Search expenses"
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
              <div className="px-7 py-5" data-kt-expense-table-filter="form">
                {/* Expense Type Filter */}
                <div className="mb-10">
                  <label className="form-label fs-6 fw-bold">Expense Type:</label>
                  <select
                    className="form-select form-select-solid fw-bolder"
                    data-kt-select2="true"
                    data-placeholder="Select expense type"
                    data-allow-clear="true"
                    data-kt-expense-table-filter="expenseType"
                    data-hide-search="true"
                    onChange={(e) => setTypeFilter(e.target.value)}
                    value={typeFilter}
                  >
                    <option value=""></option>
                    {uniqueTypes.map((type, idx) => (
                      <option key={idx} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                
                {/* Status Filter */}
                <div className="mb-10">
                  <label className="form-label fs-6 fw-bold">Approval Status:</label>
                  <select
                    className="form-select form-select-solid fw-bolder"
                    data-kt-select2="true"
                    data-placeholder="Select status"
                    data-allow-clear="true"
                    data-kt-expense-table-filter="approvalStatus"
                    data-hide-search="true"
                    onChange={(e) => setStatusFilter(e.target.value)}
                    value={statusFilter}
                  >
                    <option value=""></option>
                    <option value="approved">Approved</option>
                    <option value="pending">Pending</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
                
                {/* Actions */}
                <div className="d-flex justify-content-end">
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="btn btn-light btn-active-light-primary fw-bold me-2 px-6"
                    data-kt-menu-dismiss="true"
                    data-kt-expense-table-filter="reset"
                  >
                    Reset
                  </button>
                  <button
                    type="button"
                    onClick={applyStatusFilter}
                    className="btn btn-primary fw-bold px-6"
                    data-kt-menu-dismiss="true"
                    data-kt-expense-table-filter="filter"
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
                  <th className="px-3 min-w-150px">User</th>
                  <th className="px-3 min-w-120px">Type</th>
                  <th className="px-3 min-w-100px">Date</th>
                  <th className="px-3 min-w-100px">By</th>
                  <th className="px-3 min-w-100px">Amount</th>
                  <th className="px-3 min-w-100px">Status</th>
                  <th className="px-3 min-w-120px">External Txn ID</th>
                  <th className="px-3 min-w-150px">Narration</th>
                  <th className="px-3 min-w-80px">File</th>
                  <th className="px-3 min-w-120px">Action</th>
                </tr>
              </thead>
              <tbody className="border border-grey border-2">
                {currentData.map(exp => (
                  <tr key={exp.id}>
                    <td>
                      <a href="#" className="text-gray-900 fw-bold text-hover-primary mb-1 fs-6">
                        {exp.associatedUserId?.fullName}
                      </a>
                    </td>
                    <td className="text-primary fw-bold">{exp.expenseType?.expenseTypeDesc}</td>
                    <td>
                      {editingRow === exp.id ? (
                        <input
                          type="date"
                          value={exp.expenseDate || ''}
                          onChange={e => handleChange(exp.id, 'expenseDate', e.target.value)}
                          className="form-control form-control-sm"
                        />
                      ) : (
                        <span className="text-gray-900 fw-semibold">
                          {exp.expenseDate}
                        </span>
                      )}
                    </td>
                    <td>
                      {editingRow === exp.id ? (
                        <input
                          value={exp.expenseBy || ''}
                          onChange={e => handleChange(exp.id, 'expenseBy', e.target.value)}
                          className="form-control form-control-sm"
                        />
                      ) : (
                        <span className="text-gray-900 fw-semibold">
                          {exp.expenseBy}
                        </span>
                      )}
                    </td>
                    <td>
                      {editingRow === exp.id ? (
                        <input
                          type="number"
                          value={exp.expenseAmount || ''}
                          onChange={e => handleChange(exp.id, 'expenseAmount', parseFloat(e.target.value))}
                          className="form-control form-control-sm"
                        />
                      ) : (
                        <span className="text-danger fw-bold">
                          {exp.expenseAmount}
                        </span>
                      )}
                    </td>
                    <td>
                      <span className={`badge ${exp.expenseApprovalStatus ? 'badge-success' : 'badge-warning'}`}>
                        <strong>{exp.expenseApprovalStatus ? "Approved" : "Pending"}</strong>
                      </span>
                    </td>
                    <td>
                      {editingRow === exp.id ? (
                        <input
                          value={exp.externalTransactionId || ''}
                          onChange={e => handleChange(exp.id, 'externalTransactionId', e.target.value)}
                          className="form-control form-control-sm"
                        />
                      ) : (
                        <span className="text-warning fw-bold">
                          {exp.externalTransactionId || '—'}
                        </span>
                      )}
                    </td>
                    <td>
                      {editingRow === exp.id ? (
                        <input
                          value={exp.externalTransactionNarration || ''}
                          onChange={e => handleChange(exp.id, 'externalTransactionNarration', e.target.value)}
                          className="form-control form-control-sm"
                        />
                      ) : (
                        <span className="text-muted fw-semibold d-block" style={{
                          display: 'inline-block',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          maxWidth: '150px'
                        }} title={exp.externalTransactionNarration}>
                          {exp.externalTransactionNarration}
                        </span>
                      )}
                    </td>
                    <td>
                      {editingRow === exp.id ? (
                        <input
                          value={exp.fileLocation || ''}
                          onChange={e => handleChange(exp.id, 'fileLocation', e.target.value)}
                          className="form-control form-control-sm"
                        />
                      ) : exp.fileLocation ? (
                        <a href={exp.fileLocation} className="text-primary fw-bold" target="_blank" rel="noopener noreferrer">
                          View
                        </a>
                      ) : (
                        <span className="text-muted">—</span>
                      )}
                    </td>
                    <td>
                      {editingRow === exp.id ? (
                        <div className="d-flex gap-2">
                          <button 
                            onClick={() => handleSave(exp)} 
                            className="badge badge-success"
                            style={{border: 'none', cursor: 'pointer'}}
                          >
                            <strong>Save</strong>
                          </button>
                          <button 
                            onClick={handleCancel} 
                            className="badge badge-secondary"
                            style={{border: 'none', cursor: 'pointer'}}
                          >
                            <strong>Cancel</strong>
                          </button>
                        </div>
                      ) : (
                        <button 
                          onClick={() => handleEdit(exp.id)} 
                          className="badge badge-primary"
                          style={{border: 'none', cursor: 'pointer'}}
                        >
                          <strong>Edit</strong>
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                
                {/* Empty rows to maintain consistent table height */}
                {emptyRows.map((_, index) => (
                  <tr key={`empty-${index}`} style={{height: '45px'}}>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-900 fw-bold text-hover-danger mb-1 fs-6 text-center">
              No expenses found matching your criteria!
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

export default ExpenseManager;