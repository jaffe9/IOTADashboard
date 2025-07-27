import React, { Fragment, useEffect, useState } from 'react'
import { getInvoiceDetails, updateInvoiceStatus } from '../../../apiFactory/apiHelper'
import { toAbsoluteUrl, KTIcon, useDebounce } from '../../../_metronic/helpers';
import { MenuComponent } from '../../../_metronic/assets/ts/components';

type Props = {
  className: string
}

type invoiceDetails = {
  id: number;
  client_id: number;
  internal_invoice_no: string;
  external_invoice_no: string;
  invoice_value: number;
  invoice_url: string;
  invoice_data: Date;
  associated_user_id: { username: string, companyName: string, client_id: { client_short_name: string } };
  invoice_paid_status: boolean;
  invoice_paid_amount: string;
};

const GetInvoiceDetails: React.FC<Props> = ({ className }) => {
  const [clienOrder, setClienOrder] = useState<invoiceDetails[]>([]);
  const [filtered, setFiltered] = useState<invoiceDetails[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [clientFilter, setClientFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Debounce search term
  const debouncedSearchTerm = useDebounce(searchTerm, 150);

  useEffect(() => {
    fetchInvoiceDetails();
  }, []);

  useEffect(() => {
    MenuComponent.reinitialization()
  }, []);

  useEffect(() => {
    applyFilters();
  }, [debouncedSearchTerm, clientFilter, statusFilter, clienOrder]);

  const fetchInvoiceDetails = async () => {
    try {
      const records = await getInvoiceDetails()
      setClienOrder(records.invDetails)
    } catch (error) {
      console.error('Error fetching Invoice Details:', error);
    }
  };

  const applyFilters = () => {
    let result = [...clienOrder];

    if (debouncedSearchTerm && debouncedSearchTerm.trim()) {
      const term = debouncedSearchTerm.toLowerCase();
      result = result.filter(inv =>
        (inv.associated_user_id?.username && inv.associated_user_id.username.toLowerCase().includes(term)) ||
        (inv.external_invoice_no && inv.external_invoice_no.toLowerCase().includes(term)) ||
        (inv.internal_invoice_no && inv.internal_invoice_no.toLowerCase().includes(term)) ||
        (inv.associated_user_id?.companyName && inv.associated_user_id.companyName.toLowerCase().includes(term))
      );
    }

    if (clientFilter) {
      result = result.filter(inv => inv.client_id.toString() === clientFilter);
    }

    if (statusFilter) {
      if (statusFilter === 'paid') {
        result = result.filter(inv => inv.invoice_paid_status === true);
      } else if (statusFilter === 'pending') {
        result = result.filter(inv => inv.invoice_paid_status === false);
      }
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

  const handleInvoiceStatusUpdate = async (id: any, associated_user_id: { username: any }, external_invoice_no: any) => {
    const isConfirmed = window.confirm(`Are you sure you want to mark the invoice as paid for ${associated_user_id.username} with invoice number ${external_invoice_no}?`);

    if (!isConfirmed) {
      return;
    }

    const invoiceRecord = clienOrder.find((record) => record.id === id)

    if (!invoiceRecord) {
      console.error(`invoice with id ${id} is not findable`)
      return;
    }
    const invoice_paid_amount = invoiceRecord?.invoice_value

    try {
      await updateInvoiceStatus(id, invoice_paid_amount)
      alert(`Updated Invoice Paid Status For ${associated_user_id.username} with invoice number ${external_invoice_no}`)

      // Remove Updated Invoice
      setFiltered((pre: invoiceDetails[]) => pre.filter((u) => u.id !== id));
      setClienOrder((pre: invoiceDetails[]) => pre.filter((u) => u.id !== id));

    } catch (error) {
      console.error("Error in updating Invoice status:", error)
    }
  }

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

  const currentData = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const uniqueClients = [...new Set(clienOrder.map(e => e.client_id))];

  // Create empty rows to maintain consistent table height
  const emptyRowsCount = itemsPerPage - currentData.length;
  const emptyRows = Array(emptyRowsCount).fill(null);

  return (
    <div className={`card ${className}`}>
      {/* Card Header */}
      <div className="card-header border-0 pt-5">
        <h3 className="card-title align-items-start flex-column">
          <span className="card-label fw-bold fs-3 mb-1">Invoice Manager</span>
          <span className="text-muted mt-1 fw-semibold fs-7">Manage and track all invoices</span>
        </h3>
        <div className="card-toolbar">
          <div className="d-flex gap-3 align-items-center">
            {/* Search Component */}
            <div className="card-title">
              <div className="d-flex align-items-center position-relative my-1">
                <KTIcon iconName="magnifier" className="fs-1 position-absolute ms-6" />
                <input
                  type="text"
                  data-kt-invoice-table-filter="search"
                  className="form-control form-control-solid w-450px ps-14"
                  placeholder="Search invoices"
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
              <div className="px-7 py-5" data-kt-invoice-table-filter="form">
                {/* Client Filter */}
                <div className="mb-10">
                  <label className="form-label fs-6 fw-bold">Client:</label>
                  <select
                    className="form-select form-select-solid fw-bolder"
                    data-kt-select2="true"
                    data-placeholder="Select client"
                    data-allow-clear="true"
                    data-kt-invoice-table-filter="client"
                    data-hide-search="true"
                    onChange={(e) => setClientFilter(e.target.value)}
                    value={clientFilter}
                  >
                    <option value=""></option>
                    {uniqueClients.map((client_id, idx) => (
                      <option key={idx} value={client_id}>{getClientName(client_id)}</option>
                    ))}
                  </select>
                </div>

                {/* Status Filter */}
                <div className="mb-10">
                  <label className="form-label fs-6 fw-bold">Payment Status:</label>
                  <select
                    className="form-select form-select-solid fw-bolder"
                    data-kt-select2="true"
                    data-placeholder="Select status"
                    data-allow-clear="true"
                    data-kt-invoice-table-filter="paymentStatus"
                    data-hide-search="true"
                    onChange={(e) => setStatusFilter(e.target.value)}
                    value={statusFilter}
                  >
                    <option value=""></option>
                    <option value="paid">Paid</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>

                {/* Actions */}
                <div className="d-flex justify-content-end">
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="btn btn-light btn-active-light-primary fw-bold me-2 px-6"
                    data-kt-menu-dismiss="true"
                    data-kt-invoice-table-filter="reset"
                  >
                    Reset
                  </button>
                  <button
                    type="button"
                    onClick={applyStatusFilter}
                    className="btn btn-primary fw-bold px-6"
                    data-kt-menu-dismiss="true"
                    data-kt-invoice-table-filter="filter"
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
                  <th className="px-3 min-w-150px">User</th>
                  <th className="px-3 min-w-120px">External Invoice</th>
                  <th className="px-3 min-w-120px">Internal Invoice</th>
                  <th className="px-3 min-w-100px">Value</th>
                  <th className="px-3 min-w-100px">Status</th>
                  <th className="px-3 min-w-150px">Invoice URL</th>
                  <th className="px-3 min-w-120px">Action</th>
                </tr>
              </thead>
              <tbody className="border border-grey border-2">
                {currentData.map((record, index) => (
                  <tr key={record.id}>
                    <td>
                      <div className="symbol symbol-45px me-2">
                        <span className="symbol-label">
                          <img
                            src={updateLogoUrl(record.client_id)}
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
                    <td>
                      <a href="#" className="text-gray-900 fw-bold text-hover-primary mb-1 fs-6">
                        {record.associated_user_id?.username?.toUpperCase()}
                      </a>
                      <span className="text-muted fw-semibold d-block">
                        {record.associated_user_id?.client_id?.client_short_name}
                      </span>
                    </td>
                    <td className="text-primary fw-bold">{record.external_invoice_no}</td>
                    <td className="text-warning fw-bold">{record.internal_invoice_no}</td>
                    <td className="text-danger fw-bold">{record.invoice_value}</td>
                    <td>
                      <span className={`badge ${record.invoice_paid_status ? 'badge-success' : 'badge-warning'}`}>
                        <strong>{record.invoice_paid_status ? "Paid" : "Pending"}</strong>
                      </span>
                    </td>
                    <td>
                      {record.invoice_url ? (
                        <a href={record.invoice_url} className="text-primary fw-bold" target="_blank" rel="noopener noreferrer">
                          <span style={{
                            display: 'inline-block',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            maxWidth: '150px'
                          }} title={record.invoice_url}>
                            View Invoice
                          </span>
                        </a>
                      ) : (
                        <span className="text-muted">—</span>
                      )}
                    </td>
                    <td>
                      {!record.invoice_paid_status && (
                        <button
                          className='badge badge-success'
                          onClick={() => handleInvoiceStatusUpdate(record.id, record.associated_user_id, record.external_invoice_no)}
                          style={{ border: 'none', cursor: 'pointer' }}
                        >
                          <strong>Mark Paid</strong>
                        </button>
                      )}
                      {record.invoice_paid_status && (
                        <span className="badge badge-light-success">
                          <strong>Completed</strong>
                        </span>
                      )}
                    </td>
                  </tr>
                ))}

                {/* Empty rows to maintain consistent table height */}
                {emptyRows.map((_, index) => (
                  <tr key={`empty-${index}`} style={{ height: '45px' }}>
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
              No invoices found matching your criteria!
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

export { GetInvoiceDetails };