
import React, { Fragment, useEffect, useState } from 'react'
import {KTIcon, toAbsoluteUrl} from '../../../helpers'
import {Dropdown1} from '../../content/dropdown/Dropdown1'
import { getLeavesLeft } from '../../../../apiFactory/apiHelper'
import { numeric } from '@form-validation/bundle/popular'

type Props = {
  className: string
}

type LeaveBalanceRecord = {
  leave_accrued_current_year: number;
  leaves_used: number;
  leave_left_current_year:number;
  year:number;
  user_id: { username: string , companyName:string , employeeJoiningDate:string , contract_id:{billing_months: number} };
};

const ListsWidget3: React.FC<Props> = ({ className }) => {
  const [expiringRecords, setExpiringRecords] = useState<LeaveBalanceRecord[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<LeaveBalanceRecord[]>([]);
  const [activeTab, setActiveTab] = useState(2024); // Default to Tab 1 (2024)

  const fetchLeaveBalance = async () => {
    try {
      const records = await getLeavesLeft();

      // Sort and filter valid records by year
      const sortedRecords = records.filter((record: LeaveBalanceRecord) => record.year).sort(
        (a: LeaveBalanceRecord, b: LeaveBalanceRecord) => b.year - a.year
      );

      setExpiringRecords(sortedRecords);

      // Set filtered records for default year (2024)
      setFilteredRecords(sortedRecords.filter((record: LeaveBalanceRecord) => record.year === 2024));
    } catch (error) {
      console.error('Error fetching leave balance:', error);
    }
  };

  useEffect(() => {
    fetchLeaveBalance();
  }, []);

  // Handle Tab Click
  const handleTabClick = (year: number) => {
    setActiveTab(year);
    setFilteredRecords(expiringRecords.filter((record) => record.year === year));
  };

  return (
    <div className={`card ${className}`}>
      {/* Card Header */}
      <div className="card-header border-0 pt-5">
        <h3 className="card-title align-items-start flex-column">
          <span className="card-label fw-bold fs-3 mb-1">Employee Leave Balance</span>
          <span className="text-danger mt-1 fw-semibold fs-7">Upcoming Expiring Leaves</span>
        </h3>
        <div className="card-toolbar">
          <ul className="nav">
            <li className="nav-item">
              <a
                className={`nav-link btn btn-sm ${
                  activeTab === 2024 ? 'btn-active btn-active-light-primary active' : 'btn-color-muted'
                } fw-bold px-4 me-1`}
                onClick={() => handleTabClick(2024)}
              >
                 2024
              </a>
            </li>
            <li className="nav-item">
              <a
                className={`nav-link btn btn-sm ${
                  activeTab === 2025 ? 'btn-active btn-active-light-primary active' : 'btn-color-muted'
                } fw-bold px-4 me-1`}
                onClick={() => handleTabClick(2025)}
              >
                 2025
              </a>
            </li>
            <li className="nav-item">
              <a
                className={`nav-link btn btn-sm btn-color-muted btn-active btn-active-light-primary fw-bold px-4`}
              >
                2026
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Card Body */}
      <div className="card-body py-3">
        <div className="tab-content">
          <div
            className={`tab-pane fade ${activeTab === 2024 ? 'show active' : ''}`}
          >
            {renderTable(filteredRecords)}
          </div>
          <div
            className={`tab-pane fade ${activeTab === 2025 ? 'show active' : ''}`}
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
const renderTable = (records: LeaveBalanceRecord[]) => {
  return (
    <div className="table-responsive">
      <table className="table table-row-dashed table-row-gray-200 align-middle gs-0 gy-4 border border-grey border-2">
        <thead className="text-gray-900 fw-bold mb-1 fs-4 border border-grey border-2">
          <tr>
            <th className="p-0 w-50px"></th>
            <th className="px-px min-w-100px">Name</th>
            <th className="px-px min-w-100px">Total Leaves</th>
            <th className="px-px min-w-100px">Leaves Used</th>
            <th className="px-px min-w-50px">Leave Left</th>
            <th className="px-px min-w-50px">Joining Date</th>
            <th className="px-px min-w-50px">Billing Months</th>
          </tr>
        </thead>
        <tbody className='border border-grey border-2 hover-success'>
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
                  {record.user_id?.username?.toUpperCase()}
                </a>
                <span className="text-muted fw-semibold d-block">
                  {record.user_id?.companyName}
                </span>
              </td>
              <td className="text-primary fw-bold">{record.leave_accrued_current_year}</td>
              <td className="text-warning fw-bold">{record.leaves_used}</td>
              <td className="text-danger fw-bold">{record.leave_left_current_year}</td>
              <td className="text-primary fw-bold">{record.user_id?.employeeJoiningDate}</td>
              <th className="text-primary fw-bold">{record.user_id.contract_id.billing_months}</th>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};


export { ListsWidget3 };
