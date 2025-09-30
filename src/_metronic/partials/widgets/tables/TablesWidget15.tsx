import { useEffect, useState } from "react";
import { KTIcon, useDebounce } from "../../../helpers";
import { getPastEmplouees, updateClearanceLetterInDB, updateExitDateInDB, updateNoDueInDB, updatePastEmployeeStatus, uploadClearanceToSupabase, uploadNoDueToSupabase } from "../../../../apiFactory/apiHelper";

type Props = {
    className : string
}

type PastEmployeeDetails = {
  id: number;
  client_id: number;
  fullName: string;
  employeeJoiningDate: string;
  employeeExitDate: string;
  clearanceLetter: string;
  noDueLetter: string;
  status : string
};

const TablesWidget15: React.FC<Props> = ({ className }) => {
  const [pastEmployeeOrder, setPastEmployeeOrder] = useState<PastEmployeeDetails[]>([]);
  const [filtered, setFiltered] = useState<PastEmployeeDetails[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [clientFilter, setClientFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const itemsPerPage = 8;

  // Debounce search term
  const debouncedSearchTerm = useDebounce(searchTerm, 150);

  useEffect(() => {
    fetchPastEmployeeDetails();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [debouncedSearchTerm, clientFilter, statusFilter, pastEmployeeOrder]);

  const fetchPastEmployeeDetails = async () => {
    try {
      const records = await getPastEmplouees(); // Fetch PastEmployee data
      setPastEmployeeOrder(records);
    } catch (error) {
      console.error('Error fetching Past Employee Details:', error);
    }
  };

  const applyFilters = () => {
    let result = [...pastEmployeeOrder];

    if (debouncedSearchTerm && debouncedSearchTerm.trim()) {
      const term = debouncedSearchTerm.toLowerCase();
      result = result.filter((employee) =>
        (employee.fullName && employee.fullName.toLowerCase().includes(term))  
      );
    }

    if (clientFilter) {
      result = result.filter((employee) => employee.client_id.toString() === clientFilter);
    }

    setFiltered(result);
  };

  const resetFilters = () => {
    setStatusFilter('');
    setClientFilter('');
    setSearchTerm('');
    setCurrentPage(1);
  };

  const applyStatusFilter = () => {
    setCurrentPage(1);
    applyFilters();
  };
const toggleStatus = async (id : number , currentStatus : string) => {
   const newStatus = currentStatus === "OnNotice" ? "Exited" : "OnNotice" 
   setPastEmployeeOrder((prev) =>
      prev.map((employee) =>
        employee.id === id ? { ...employee, status: newStatus } : employee
      )
    );
    // Call API or backend to save this status change
    try {
        await updatePastEmployeeStatus(id , newStatus) 
    }catch(error){
        console.error("Error Occured while updating the status of past employee:",error)
    }
  }
const handleDateUpdate = async (id: number, newDate: string) => {
  if (newDate) {
    setPastEmployeeOrder((prev) =>
      prev.map((employee) =>
        employee.id === id ? { ...employee, employeeExitDate: newDate } : employee
      )
    );
     await updateExitDateInDB(id, newDate);
  }
};
const handleClearanceFileUpload = async (id: number) => {
  const fileInput = document.getElementById(`clearanceFile-${id}`) as HTMLInputElement;
  if (fileInput?.files?.[0]) {
    try {
      const file = fileInput.files[0];
      const fileUrl = await uploadClearanceToSupabase(file); // Call your upload function

      if (fileUrl) {
        // Update the state with the returned URL (ensure it's always a string)
        setPastEmployeeOrder((prev) =>
          prev.map((employee) =>
            employee.id === id ? { ...employee, clearanceLetter: fileUrl || "" } : employee
          )
        );
        // upload the file Url in the data base 
           await updateClearanceLetterInDB(id, fileUrl);
      } else {
        console.error("File upload failed or URL not returned.");
      }
    } catch (error) {
      console.error("Error uploading clearance letter:", error);
    }
  }
};

const handleNoDueFileUpload = async (id: number) => {
  const fileInput = document.getElementById(`noDueFile-${id}`) as HTMLInputElement;
  if (fileInput?.files?.[0]) {
    try {
      const file = fileInput.files[0];
      const fileUrl = await uploadNoDueToSupabase(file); // Call your upload function

      if (fileUrl) {
        // Update the state with the returned URL (ensure it's always a string)
        setPastEmployeeOrder((prev) =>
          prev.map((employee) =>
            employee.id === id ? { ...employee, noDueLetter: fileUrl || "" } : employee
          )
        );
         // upload the file Url in the data base 
           await updateNoDueInDB(id, fileUrl);
      } else {
        console.error("File upload failed or URL not returned.");
      }
    } catch (error) {
      console.error("Error uploading no due letter:", error);
    }
  }
};

  // To dynamically change logo of clients based on client_id
  const updateLogoUrl = (client_id: number) => {
    switch (client_id) {
      case 1:
        return '/media/svg/bank-Logos/anbLogo.png'
      case 2:
        return '/media/svg/bank-Logos/rbLogo.png'
      case 3:
        return '/media/svg/bank-Logos/sabLogo.png'
      case 4:
        return '/media/svg/bank-Logos/arbLogo.png'
      case 5:
        return '/media/svg/card-logos/american-express-dark.svg'
      default:
        return '/media/svg/bank-Logos/anbLogo.png'
    }
  }

  const getClientName = (client_id: number) => {
    switch (client_id) {
      case 1: return 'ANB'
      case 2: return 'RB'
      case 3: return 'SAB'
      case 4: return 'ARB'
      case 5: return 'AMEX'
      default: return 'Unknown'
    }
  }

  const handleMoveToExit = () => {
    // Add your logic here for moving to exit
    window.location.href = '/createPastEmployee'; // Replace with actual URL
  };

  const currentData = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const uniqueClients = [...new Set(pastEmployeeOrder?.map((e) => e.client_id))];

  return (
    <div className={`card ${className}`}>
      {/* Card Header */}
      <div className="card-header border-0 pt-5">
        <h3 className="card-title align-items-start flex-column">
          <span className="card-label fw-bold fs-3 mb-1">Past Employee Manager</span>
          <span className="text-muted mt-1 fw-semibold fs-7">Manage and track all past employees</span>
        </h3>
        <div className="card-toolbar">
          <div className="d-flex gap-3 align-items-center">
            {/* Search Component */}
            <div className="card-title">
              <div className="d-flex align-items-center position-relative my-1">
                <KTIcon iconName="magnifier" className="fs-1 position-absolute ms-6" />
                <input
                  type="text"
                  data-kt-pastemployee-table-filter="search"
                  className="form-control form-control-solid w-450px ps-14"
                  placeholder="Search past employees"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Move To Exit Button */}
            <button
              type="button"
              className="btn btn-light-primary me-3"
              onClick={handleMoveToExit}
            >
              + Employee
            </button>

            {/* Filter Button */}
            <button
              type="button"
              className="btn btn-light-primary me-3"
              data-kt-menu-trigger="click"
              data-kt-menu-placement="bottom-end"
              onClick={() => setShowFilterMenu(!showFilterMenu)}
            >
              <KTIcon iconName="filter" className="fs-2" />
              Filter
            </button>

            {/* Filter SubMenu */}
            <div className="menu menu-sub menu-sub-dropdown w-300px w-md-325px" data-kt-menu="true">
              <div className="px-7 py-5">
                <div className="fs-5 text-gray-900 fw-bolder">Filter Options</div>
              </div>
              <div className="separator border-gray-200"></div>
              <div className="px-7 py-5" data-kt-pastemployee-table-filter="form">
                {/* Client Filter */}
                <div className="mb-10">
                  <label className="form-label fs-6 fw-bold">Client:</label>
                  <select
                    className="form-select form-select-solid fw-bolder"
                    data-kt-select2="true"
                    data-placeholder="Select client"
                    data-allow-clear="true"
                    data-kt-pastemployee-table-filter="client"
                    data-hide-search="true"
                    onChange={(e) => setClientFilter(e.target.value)}
                    value={clientFilter}
                  >
                    <option value=""></option>
                    {uniqueClients.map((clientId, idx) => (
                      <option key={idx} value={clientId}>{getClientName(clientId)}</option>
                    ))}
                  </select>
                </div>

                {/* Actions */}
                <div className="d-flex justify-content-end">
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="btn btn-light btn-active-light-primary fw-bold me-2 px-6"
                    data-kt-menu-dismiss="true"
                    data-kt-pastemployee-table-filter="reset"
                  >
                    Reset
                  </button>
                  <button
                    type="button"
                    onClick={applyStatusFilter}
                    className="btn btn-primary fw-bold px-6"
                    data-kt-menu-dismiss="true"
                    data-kt-pastemployee-table-filter="filter"
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
        <div className="table-responsive" style={{ minHeight: '500px' }}>
          {filtered.length > 0 ? (
            <table className="table table-row-dashed table-row-gray-200 align-middle gs-0 gy-4 border border-y border-white">
              <thead className="text-gray-900 fw-bold mb-1 fs-4">
                <tr className="border border-grey border-2">
                  <th className="px-3 w-50px">Client</th>
                  <th className="px-3 min-w-150px">Full Name</th>
                  <th className="px-3 min-w-150px">Joining Date</th>
                  <th className="px-3 min-w-150px">Exit Date</th>
                  <th className="px-3 min-w-150px">Status</th>
                  <th className="px-3 min-w-150px">Clearance Letter</th>
                  <th className="px-3 min-w-150px">No Due Letter</th>
                </tr>
              </thead>
              <tbody className="border border-grey border-2">
                {currentData.map((employee, index) => (
                  <tr key={employee.id}>
                    <td>
                      <div className="symbol symbol-45px me-2">
                        <span className="symbol-label">
                          <img
                            src={updateLogoUrl(employee.client_id)}
                            className="h-35 align-self-center"
                            style={{
                              width: '35px',
                              border: '1px solid #e4e6ef',
                              borderRadius: '6px',
                              padding: '5px'
                            }}
                            alt="logo"
                          />
                        </span>
                      </div>
                    </td>
                    <td className="text fw-bold">{employee.fullName}</td>
                    <td className="text fw-bold">{employee.employeeJoiningDate}</td>
                    <td className="text fw-bold">{employee.employeeExitDate ? (employee.employeeExitDate)
                     : (<input
                      type="date"
                      className="form-control"
                      onChange={(e) => handleDateUpdate(employee.id, e.target.value)}
                      />)}
                     </td>
                    <td className="text fw-bold">
                     <button
                        className={`btn btn-sm ${employee.status === 'Exited' ? 'btn-danger' : 'btn-warning'}`}
                        onClick={() => toggleStatus(employee.id, employee.status)}
                      >
                        {employee.status}
                      </button>
                    </td>
                    <td>
                       {employee.clearanceLetter ? (
                        <a href={employee.clearanceLetter} className="text-primary fw-bold" target="_blank" rel="noopener noreferrer">
                          View
                        </a>
                      ) : (
                        <input
                          type="file"
                          id={`clearanceFile-${employee.id}`}
                          className="form-control"
                          onChange={() => handleClearanceFileUpload(employee.id)}
                        />
                      )}
                    </td>
                    <td>
                      {employee.noDueLetter ? (
                        <a href={employee.noDueLetter} className="text-primary fw-bold" target="_blank" rel="noopener noreferrer">
                          View
                        </a>
                      ) : (
                        <input
                          type="file"
                          id={`noDueFile-${employee.id}`}
                          className="form-control"
                          onChange={() => handleNoDueFileUpload(employee.id)}
                        />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-900 fw-bold text-hover-danger mb-1 fs-6 text-center">
              No past employees found matching your criteria!
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

export { TablesWidget15 };