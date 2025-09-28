import { useEffect, useState } from "react"
import { KTIcon, useDebounce } from "../../../helpers";
import { getProposals, updateProposalStatus } from "../../../../apiFactory/apiHelper";


type Props = {
  className: string
}
type proposalDetails = {
  id: number;
  clientId: number;
  resourceName: string;
  billingAnnually: number;
  billingMonths: string;
  version: number;
  status: string;
  url: string;
  designation: string;
};

const TablesWidget14: React.FC<Props> = ({ className }) => {
  const [proposalOrder, setProposalOrder] = useState<proposalDetails[]>([]);
  const [filtered, setFiltered] = useState<proposalDetails[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [clientFilter, setClientFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilterMenu, setShowFilterMenu] = useState(false)
  const itemsPerPage = 8;

  // Debounce search term
  const debouncedSearchTerm = useDebounce(searchTerm, 150);

  useEffect(() => {
    fetchProposalDetails();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [debouncedSearchTerm, clientFilter, statusFilter, proposalOrder]);

  const fetchProposalDetails = async () => {
    try {
      const records = await getProposals(); // Adjust to your API for proposals
    //   console.log(`This is the records ${records}`)
      setProposalOrder(records); // Adjust based on the API response
    } catch (error) {
      console.error('Error fetching Proposal Details:', error);
    }
  };

  const applyFilters = () => {
    let result = [...proposalOrder];

    if (debouncedSearchTerm && debouncedSearchTerm.trim()) {
      const term = debouncedSearchTerm.toLowerCase();
      result = result.filter(proposal =>
        (proposal.resourceName && proposal.resourceName.toLowerCase().includes(term)) ||
        (proposal.designation && proposal.designation.toLowerCase().includes(term)) ||
        (proposal.status && proposal.status.toLowerCase().includes(term)) 
      );
    }

    if (clientFilter) {
      result = result.filter(proposal => proposal.clientId.toString() === clientFilter);
    }

    if (statusFilter) {
      result = result.filter(proposal => proposal.status.toLowerCase() === statusFilter.toLowerCase());
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
 const getClientName = (clientId: number) => {
    switch (clientId) {
      case 1: return 'ANB'
      case 2: return 'RB'
      case 3: return 'SAB'
      case 4: return 'ARB'
      case 5: return 'AMEX'
      default: return 'Unknown'
    }
  }

  const  handleStatusChange = async( id : number, newStatus : string) => {
    const isConfirmed = window.confirm(`Are you sure you want to update the status as ${newStatus} with proposal id ${id} `)

    if (!isConfirmed){
        return ;
    } 
    const proposalRecord = proposalOrder.find((record) => record.id === id)
    
    if (!proposalRecord){
        alert(`proposal with the following id ${id} is not found !`)
        return ;
    }
    try {
      await updateProposalStatus(id,newStatus)
      alert(`Updated Proposal Status as ${newStatus} for id ${id} `)
    //   setFiltered((pre:proposalDetails[])  => pre.filter((p) => p.id !== id))
    //   setProposalOrder((pre: proposalDetails[]) => pre.filter((u) => u.id !== id));
    fetchProposalDetails();
    }catch(error){
        console.error("Error in updating Proposal status:", error)
    }
  }

  const currentData = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const uniqueClients = [...new Set(proposalOrder?.map(e => e.clientId))];

  return (
    <div className={`card ${className}`}>
      {/* Card Header */}
      <div className="card-header border-0 pt-5">
        <h3 className="card-title align-items-start flex-column">
          <span className="card-label fw-bold fs-3 mb-1">Proposal Manager</span>
          <span className="text-muted mt-1 fw-semibold fs-7">Manage and track all proposals</span>
        </h3>
        <div className="card-toolbar">
          <div className="d-flex gap-3 align-items-center">
            {/* Search Component */}
            <div className="card-title">
              <div className="d-flex align-items-center position-relative my-1">
                <KTIcon iconName="magnifier" className="fs-1 position-absolute ms-6" />
                <input
                  type="text"
                  data-kt-proposal-table-filter="search"
                  className="form-control form-control-solid w-450px ps-14"
                  placeholder="Search proposals"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* + Proposal Button */}
            <button
              type="button"
              className="btn btn-light-primary me-3"
            //   data-kt-menu-trigger="click"
            //   data-kt-menu-placement="bottom-end"
              onClick={() => window.location.href = '/createProposal'} // Replace with actual URL
            >
              + Proposal
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
              {/* Header */}
              <div className="px-7 py-5">
                <div className="fs-5 text-gray-900 fw-bolder">Filter Options</div>
              </div>

              {/* Separator */}
              <div className="separator border-gray-200"></div>

              {/* Content */}
              <div className="px-7 py-5" data-kt-proposal-table-filter="form">
                {/* Client Filter */}
                <div className="mb-10">
                  <label className="form-label fs-6 fw-bold">Client:</label>
                  <select
                    className="form-select form-select-solid fw-bolder"
                    data-kt-select2="true"
                    data-placeholder="Select client"
                    data-allow-clear="true"
                    data-kt-proposal-table-filter="client"
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

                {/* Status Filter */}
                <div className="mb-10">
                  <label className="form-label fs-6 fw-bold">Status:</label>
                  <select
                    className="form-select form-select-solid fw-bolder"
                    data-kt-select2="true"
                    data-placeholder="Select status"
                    data-allow-clear="true"
                    data-kt-proposal-table-filter="status"
                    data-hide-search="true"
                    onChange={(e) => setStatusFilter(e.target.value)}
                    value={statusFilter}
                  >
                    <option value=""></option>
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                    <option value="Revised">Revised</option>
                  </select>
                </div>

                {/* Actions */}
                <div className="d-flex justify-content-end">
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="btn btn-light btn-active-light-primary fw-bold me-2 px-6"
                    data-kt-menu-dismiss="true"
                    data-kt-proposal-table-filter="reset"
                  >
                    Reset
                  </button>
                  <button
                    type="button"
                    onClick={applyStatusFilter}
                    className="btn btn-primary fw-bold px-6"
                    data-kt-menu-dismiss="true"
                    data-kt-proposal-table-filter="filter"
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
                  <th className="px-3 min-w-150px">Resource</th>
                  <th className="px-3 min-w-150px">Designation</th>
                  <th className="px-3 min-w-120px">Billing Annually</th>
                  <th className="px-3 min-w-120px">Billing Months</th>
                  <th className="px-3 min-w-100px">Version</th>
                  <th className="px-3 min-w-100px">Status</th>
                  <th className="px-3 min-w-150px">URL</th>
                  {/* <th className="px-3 min-w-120px">Action</th> */}
                </tr>
              </thead>
              <tbody className="border border-grey border-2">
                {currentData.map((proposal, index) => (
                  <tr key={proposal.id}>
                    <td>
                      <div className="symbol symbol-45px me-2">
                        <span className="symbol-label">
                          <img
                            src={updateLogoUrl(proposal.clientId)}
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
                    <td className="text fw-bold">{proposal.resourceName}</td>
                    <td className="text fw-bold">{proposal.designation}</td>
                    <td className="text fw-bold">{proposal.billingAnnually.toLocaleString("en-Us",{maximumFractionDigits:2,minimumFractionDigits:2})}</td>
                    <td className="text fw-bold">{proposal.billingMonths}</td>
                    <td className="text-danger fw-bold">{proposal.version}</td>
                    {/* <td>
                      <span className={`badge ${proposal.status === 'approved' ? 'badge-success' : proposal.status === 'rejected' ? 'badge-danger' : 'badge-warning'}`}>
                        <strong>{proposal.status}</strong>
                      </span>
                    </td> */}
                    <td>
  <div className="btn-group" role="group" aria-label="Proposal Status">
    <button
      type="button"
      className={`btn btn-sm ${proposal.status === 'accepted' ? 'btn-success' : 'btn-outline-success'}`}
      onClick={() => handleStatusChange(proposal.id, 'accepted')}
    >
      Accepted
    </button>
    <button
      type="button"
      className={`btn btn-sm ${proposal.status === 'rejected' ? 'btn-danger' : 'btn-outline-danger'}`}
      onClick={() => handleStatusChange(proposal.id, 'rejected')}
    >
      Rejected
    </button>
    <button
      type="button"
      className={`btn btn-sm ${proposal.status === 'pending' ? 'btn-warning' : 'btn-outline-warning'}`}
      onClick={() => handleStatusChange(proposal.id, 'pending')}
    >
      Pending
    </button>
    <button
      type="button"
      className={`btn btn-sm ${proposal.status === 'revised' ? 'btn-info' : 'btn-outline-info'}`}
      onClick={() => handleStatusChange(proposal.id, 'revised')}
    >
      Revised
    </button>
  </div>
</td>
                    <td>
                      {proposal.url ? (
                        <a href={proposal.url} className="text-primary fw-bold" target="_blank" rel="noopener noreferrer">
                          <span style={{
                            display: 'inline-block',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            maxWidth: '150px'
                          }} title={proposal.url}>
                            View Proposal
                          </span>
                        </a>
                      ) : (
                        <span className="text-muted">—</span>
                      )}
                    </td>
                    {/* <td>
                      <button
                        className='badge badge-success'
                        onClick={() => handleProposalStatusUpdate(proposal.id, proposal.associated_user_id, proposal.resourceName)}
                        style={{ border: 'none', cursor: 'pointer' }}
                      >
                        <strong>Update Status</strong>
                      </button>
                    </td> */}
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-900 fw-bold text-hover-danger mb-1 fs-6 text-center">
              No proposals found matching your criteria!
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

export { TablesWidget14 };