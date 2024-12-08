
import React, { Fragment, useEffect, useState } from 'react'
import {KTIcon} from '../../../helpers'
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
    <div className={`card`}>      
    {/* begin::Header */}
    <div className='card-header border-0'>
      <h3 className='card-title fw-bold text-gray-900'>Employee Leave Balance</h3>
      <div className='card-toolbar'>
        {/* begin::Menu */}
        <button
          type='button'
          className='btn btn-sm btn-icon btn-color-primary btn-active-light-primary'
          data-kt-menu-trigger='click'
          data-kt-menu-placement='bottom-end'
          data-kt-menu-flip='top-end'
        >
          <KTIcon iconName='category' className='fs-2' />
        </button>
        <Dropdown1 />
        {/* end::Menu */}
      </div>
    </div>
    {/* end::Header */}

    {/* begin::Body */}
    <div className='card-body pt-2'>
      <div className='table-responsive'>
        <table className='table table table-hover color-yellow'>
          {/* Table Header */}
          <thead>
            <tr className='text-gray-900 fw-bold  mb-1 fs-6'>
              <th>Username</th>
              <th>Total Leaves</th>
              <th>Leaves Used</th>
              <th>Leave Left</th>
              <th>Year</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>
            {expiringRecords.map((record, index) => (
              <tr key={`user-id-${index}`} className='text-gray-900 fw-bold text-hover-primary mb-1 fs-6'>
                <td>{record.user_id?.username?.toUpperCase()}</td>
                <td>{record.leave_accrued_current_year}</td>
                <td>{record.leaves_used}</td>
                <td className='text-900 fw-bold text-hover-danger mb-1 fs-6'>{record.leave_left_current_year}</td>
                <td>{record.year}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    {/* end::Body */}
  </div>
);
};

export {ListsWidget3}
