
import React, { Fragment, useEffect, useState } from 'react'
import { getInvoiceDetails, updateInvoiceStatus } from '../../../apiFactory/apiHelper'
import { toAbsoluteUrl } from '../../../_metronic/helpers';
import { number } from 'yup';



type Props = {
  className: string
}

type invoiceDetails = {
  id : number ;
  client_id : number;
  internal_invoice_no:string;
  external_invoice_no:string;
  invoice_value:number;
  invoice_url:string;
  invoice_data:Date;
  associated_user_id: { username: string , companyName:string , clientId:{ client_short_name:string} };
  invoice_paid_status : boolean;
  invoice_paid_amount : string;
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

  const handleInvoiceStatusUpdate = async (id : any , associated_user_id:{username : any} , external_invoice_no :any ) => {
    // Show confirmation dialog before proceeding
      const isConfirmed = window.confirm(`Are you sure you want to mark the invoice as paid for ${associated_user_id.username} with invoice number ${external_invoice_no}?`);

           if (!isConfirmed) {
          return; // Exit if user cancels
       }


   // Using Client order find the record that matchers the selected id 
    const invoiceRecord = clienOrder.find((record) => record.id === id)

    if(!invoiceRecord){
     console.error(`invoice with id ${id} is not findable`)
     return;
    }
    const invoice_paid_amount = invoiceRecord?.invoice_value // updating invoice paid amount by taking from invoicerecord

    try{
        await updateInvoiceStatus(id , invoice_paid_amount )
        alert(`Updated Invoice Paid Status For ${associated_user_id.username} with invoice number ${external_invoice_no}  `)
    
        // Remove Updated Invoice
        setFilteredRecords((pre:invoiceDetails[]) => pre.filter((u) => u.id !== id));

    
    }catch(error){
     console.error("Erron in updating Invoice status :" , error)
    }
 }

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
                className={`nav-link btn btn-sm ${
                  activeTab === 4 ? 'btn-active btn-active-light-primary active' : 'btn-color-muted'
                } fw-bold px-4 me-1`}
                onClick={() => handleTabClick(4)}
              >
                 ARB
              </a>
            </li>
            <li className="nav-item">
            <a
                className={`nav-link btn btn-sm ${
                  activeTab === 5 ? 'btn-active btn-active-light-primary active' : 'btn-color-muted'
                } fw-bold px-4 me-1`}
                onClick={() => handleTabClick(5)}
              >
                 AMEX
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
            {renderTable(filteredRecords , handleInvoiceStatusUpdate)}
          </div>
          <div
            className={`tab-pane fade ${activeTab === 2 ? 'show active' : ''}`}
          >
            {renderTable(filteredRecords , handleInvoiceStatusUpdate)}
          </div>
          <div
            className={`tab-pane fade ${activeTab === 4 ? 'show active' : ''}`}
          >
            {renderTable(filteredRecords , handleInvoiceStatusUpdate)}
          </div>
          <div
            className={`tab-pane fade ${activeTab === 5 ? 'show active' : ''}`}
          >
            {renderTable(filteredRecords , handleInvoiceStatusUpdate)}
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
const renderTable = (records: invoiceDetails[] ,  handleInvoiceStatusUpdate : (id : any ,associated_user_id:{username:any} , external_invoice_no:any , invoice_paid_amount : any ) => void) => {
 
   
  return (
    <div className="table-responsive">
      <table className="table table-row-dashed table-row-gray-200  align-middle gs-0 gy-4 border border-y border-white">
        <thead className="text-gray-900 fw-bold mb-1 fs-4">
          <tr className='border border-grey border-2'>
            <th className="p-0 w-50px"></th>
            <th className="px-px min-w-100px">Name</th>
            <th className="px-px min-w-100px">Invoice Number</th>
            <th className="px-px min-w-100px">Internal Number</th>
            <th className="px-px min-w-100px">Value</th>
            <th className="px-px min-w-100px">Status</th>
            <th className="px-px min-w-100px"> Url</th>
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
              <td>
              <button 
                className='badge badge-success'
                 onClick={() => handleInvoiceStatusUpdate(record.id , record.associated_user_id ,record.external_invoice_no , record.invoice_paid_amount)}  // Pass the correct `id`
                >
                <strong> Mark Paid </strong>
                </button>
              </td>
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
