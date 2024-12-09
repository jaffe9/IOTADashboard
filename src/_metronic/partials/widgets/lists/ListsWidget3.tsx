
import React, { Fragment, useEffect, useState } from 'react'
import {KTIcon, toAbsoluteUrl} from '../../../helpers'
import {Dropdown1} from '../../content/dropdown/Dropdown1'
import { getLeavesLeft } from '../../../../apiFactory/apiHelper'

type Props = {
  className: string
}

type LeaveBalanceRecord = {
  leave_accrued_current_year: number;
  leaves_used: number;
  leave_left_current_year:number;
  year:string;
  user_id: { username: string , companyName:string };
};

const ListsWidget3: React.FC<Props> = ({className}) => {
  const [expiringRecords, setExpiringRecords] = useState<LeaveBalanceRecord[]>([]);

  const fetchLeaveBalance = async () => {
    const records = await getLeavesLeft();
    const sortByYear = records
    .sort((a: { year: number } , b: { year: number }) => b.year - a.year )
    setExpiringRecords(sortByYear);
  }

  useEffect(() => {
    fetchLeaveBalance();
  }, []);
  return (
    <div className={`card ${className}`}>      
      {/* begin::Header */}
      <div className='card-header border-0 pt-5'>
        <h3 className='card-title align-items-start flex-column'>
          <span className='card-label fw-bold fs-3 mb-1'>Employee Leave Balance</span>
          <span className='text-danger mt-1 fw-semibold fs-7'>
            Upcoming Expiring Leaves
          </span>
        </h3>
        <div className='card-toolbar'>
          <ul className='nav'>
            <li className='nav-item'>
              <a
                className='nav-link btn btn-sm btn-color-muted btn-active btn-active-light-primary active fw-bold px-4 me-1'
                data-bs-toggle='tab'
                href='#kt_table_widget_5_tab_1'
              >
                Tab 1
              </a>
            </li>
            <li className='nav-item'>
              <a
                className='nav-link btn btn-sm btn-color-muted btn-active btn-active-light-primary fw-bold px-4 me-1'
                data-bs-toggle='tab'
                href='#kt_table_widget_5_tab_2'
              >
                Tab 2
              </a>
            </li>
            <li className='nav-item'>
              <a
                className='nav-link btn btn-sm btn-color-muted btn-active btn-active-light-primary fw-bold px-4'
                data-bs-toggle='tab'
                href='#kt_table_widget_5_tab_3'
              >
                Tab 3
              </a>
            </li>
          </ul>
        </div>
      </div>
      {/* end::Header */}
  
      {/* begin::Body */}
      <div className='card-body py-3'>
        <div className='tab-content'>
          <div className='tab-pane fade show active' id='kt_table_widget_5_tab_1'>
            <div className='table-responsive'>
              <table className='table table-row-dashed table-row-gray-200 align-middle gs-0 gy-4'>
                <thead className='text-gray-900 fw-bold  mb-1 fs-4'>
                  <tr className='border-10'>
                    <th className='p-0 w-50px'></th>
                    <th className='p-0 min-w-150px'>Username</th>
                    <th className='p-0 min-w-140px'>Total Leaves</th>
                    <th className='p-0 min-w-110px'>Leaves Used</th>
                    <th className='p-0 min-w-50px'>Leave Left</th>
                    <th className='p-0 min-w-50px'>Year</th>
                  </tr>
                </thead>
                <tbody>
                  {expiringRecords.map((record, index) => (
                    <tr key={index}>
                      <td>
                        <div className='symbol symbol-45px me-2'>
                          <span className='symbol-label'>
                            <img
                              src={toAbsoluteUrl(
                                `media/svg/brand-logos/${
                                  index % 5 === 0
                                    ? 'plurk'
                                    : index % 5 === 1
                                    ? 'telegram'
                                    : index % 5 === 2
                                    ? 'vimeo'
                                    : index % 5 === 3
                                    ? 'bebo'
                                    : 'kickstarter'
                                }.svg`
                              )}
                              className='h-50 align-self-center'
                              alt='logo'
                            />
                          </span>
                        </div>
                      </td>
                      <td>
                        <a
                          href='#'
                          className='text-gray-900 fw-bold text-hover-primary mb-1 fs-6'
                        >
                          {record.user_id?.username?.toUpperCase()}
                        </a>
                        <span className='text-muted fw-semibold d-block'>
                          {record.user_id?.companyName}
                        </span>
                      </td>
                      <td className='text-primary fw-bold'>
                        {record.leave_accrued_current_year}
                      </td>
                      <td className='text-warning fw-bold'>
                        {record.leaves_used}
                      </td>
                      <td className='text-danger fw-bold'>
                        {record.leave_left_current_year}
                      </td>
                      <td className='text-primary fw-bold'>
                        {record.year}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      {/* end::Body */}
    </div>
  );
};

export {ListsWidget3}
