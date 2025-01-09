
import React, { Fragment, useEffect, useState } from 'react'
import { getInvoiceDetails } from '../../../apiFactory/apiHelper'
import { toAbsoluteUrl } from '../../../_metronic/helpers';



type Props = {
  className: string
}

type invoiceDetails = {
  client_id : number;
  internal_invoice_no:string;
  external_invoice_no:string;
  invoice_value:number;
  invoice_url:string;
  invoice_data:Date;
  associated_user_id: { username: string , companyName:string , clientId:{ client_short_name:string} };
};

const GetInvoiceDetails: React.FC<Props> = ({ className }) => {
  const [clienOrder, setClienOrder] = useState<invoiceDetails[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<invoiceDetails[]>([]);
  const [activeTab, setActiveTab] = useState(1); // Default to Tab 1 (client id=1)

  const fetchInvoiceDetails = async () => {
    try {
      const records = await getInvoiceDetails()
      // Set records 
      setClienOrder(records)
      
      // Set filtered records for default client  (ANB, RB, ARB)
      setFilteredRecords(records.filter((record: invoiceDetails) => record.client_id === 1));
    } catch (error) {
      console.error('Error fetching Invice Details:', error);
    }
  };

  useEffect(() => {
    fetchInvoiceDetails();
  }, []);

  // Handle Tab Click
  const handleTabClick = (client_id: number) => {
    setActiveTab(client_id);
   setFilteredRecords(clienOrder.filter((record) => record.client_id === client_id ));
  };

  return (
    <div className={`card ${className}`}>
      {/* Card Header */}
      <div className="card-header border-0  pt-5">
        <h3 className="card-title align-items-start flex-column">
          <span className="card-label fw-bold fs-3 mb-1">Pending Invoices</span>
          <span className="text-primary mt-1 fw-semibold fs-7">Select Tab To Change Client</span>
        </h3>
        <div className="card-toolbar">
          <ul className="nav">
            <li className="nav-item">
              <a
                className={`nav-link btn btn-sm ${
                  activeTab === 1 ? 'btn-active btn-active-light-primary active' : 'btn-color-muted'
                } fw-bold px-4 me-1`}
                onClick={() => handleTabClick(1)}
              >
                 ANB
              </a>
            </li>
            <li className="nav-item">
              <a
                className={`nav-link btn btn-sm ${
                  activeTab === 2 ? 'btn-active btn-active-light-primary active' : 'btn-color-muted'
                } fw-bold px-4 me-1`}
                onClick={() => handleTabClick(2)}
              >
                 RB
              </a>
            </li>
            <li className="nav-item">
              <a
                className={`nav-link btn btn-sm btn-color-muted btn-active btn-active-light-primary fw-bold px-4`}
              >
                ARB
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Card Body */}
      <div className="card-body py-3">
        <div className="tab-content">
          <div
            className={`tab-pane fade ${activeTab === 1 ? 'show active' : ''}`}
          >
            {renderTable(filteredRecords)}
          </div>
          <div
            className={`tab-pane fade ${activeTab === 2 ? 'show active' : ''}`}
          >
            {renderTable(filteredRecords)}
          </div>
          <div className="tab-pane fade" id="kt_table_widget_5_tab_3">
            {/* Tab 3 content (if applicable) */}
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper Function to Render Table
const renderTable = (records: invoiceDetails[]) => {
  return (
    <div className="table-responsive">
      <table className="table table-row-dashed table-row-gray-200  align-middle gs-0 gy-4 border border-y border-white">
        <thead className="text-gray-900 fw-bold mb-1 fs-4">
          <tr className='border border-grey border-2'>
            <th className="p-0 w-50px"></th>
            <th className="text text-grey font-mono">Name</th>
            <th className="text text-grey font-mono">Invoice Number</th>
            <th className="text text-grey font-mono">Internal Invoice Number</th>
            <th className="text text-grey font-mono">Value</th>
            <th className="text text-grey font-mono"> Invoice Url</th>
          </tr>
        </thead>
        <tbody className='border border-grey border-2'>
          {records.map((record, index) => (
            <tr key={index}>
              <td>
                <div className="symbol symbol-45px me-2">
                  <span className="symbol-label">
                    <img
                      src={toAbsoluteUrl(
                        `media/svg/brand-logos/${['plurk', 'telegram', 'vimeo', 'bebo', 'kickstarter'][index % 5]}.svg`
                      )}
                      className="h-50 align-self-center"
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
                  {record.associated_user_id?.clientId?.client_short_name}
                </span>
              </td>
              <td className="text-primary fw-bold">{record.external_invoice_no}</td>
              <td className="text-warning fw-bold">{record.internal_invoice_no}</td>
              <td className="text-danger fw-bold">{record.invoice_value}</td>
              <td className="text-primary fw-bold"><a target="_blank" href={`${record.invoice_url}`}><style
               style={{
                display: 'inline-block',
                whiteSpace : 'nowrap',
                overflow : 'hidden'
               }}
              >{record.invoice_url}</style></a></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};


export { GetInvoiceDetails };
