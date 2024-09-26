
import { FC, useEffect, useState } from 'react'
import {KTIcon} from '../../../helpers'
import { getEmployeesForOnboarding } from '../../../../apiFactory/apiHelper';
import { EmployeeOnboardingResponse } from '../../../../app/modules/apps/user-management/users-list/core/_models';

type Props = {className: string}
let apiData : EmployeeOnboardingResponse = {}
var maxRowLength = 0//Object.keys(apiData).length;

//let [apiData, setProducts] = useState<EmployeeOnboardingResponse>();
const TablesWidget10: FC<Props> = ({className}) => {
useEffect(() => 
    {
      getEmployeesForOnboarding().then(async function(data: EmployeeOnboardingResponse) 
      {
        apiData = await JSON.parse(JSON.stringify(data.data))
        maxRowLength = Object.keys(apiData).length;
      })
    },[])
  return (
    <div className={`card ${className}`}>
      {/* begin::Header */}
      <div className='card-header border-0 pt-5'>
        <h3 className='card-title align-items-start flex-column'>
          <span className='card-label fw-bold fs-3 mb-1'>Employee Onboarding</span>
          <span className='text-muted mt-1 fw-semibold fs-7'>{maxRowLength} members</span>
        </h3>
        <div
          className='card-toolbar'
          data-bs-toggle='tooltip'
          data-bs-placement='top'
          data-bs-trigger='hover'
          title='Click to add a user'
        >
          <a
            href='#'
            className='btn btn-sm btn-light-primary'
            // data-bs-toggle='modal'
            // data-bs-target='#kt_modal_invite_friends'
          >
            <KTIcon iconName='plus' className='fs-3' />
            New Member
          </a>
        </div>
      </div>
      {/* end::Header */}
      {/* begin::Body */}
      <div className='card-body py-3'>
        {/* begin::Table container */}
        <div className='table-responsive'>
          {/* begin::Table */}
          <table className='table table-row-dashed table-row-gray-300 align-middle gs-0 gy-4'>
            {/* begin::Table head */}
            <thead>
              <tr className='fw-bold text-muted'>
                <th className='min-w-150px'>Resource Name</th>
                <th className='min-w-140px'>Client</th>
                <th className='min-w-120px'>Progress</th>
                <th className='min-w-100px text-end'>Actions</th>
              </tr>
              
            </thead>
            {/* end::Table head */}
            {/* begin::Table body */}
            
            {[...Array(maxRowLength)].map((index) => 
            {
              return (
                <tbody>
                  {Object.values(apiData).map((item:any) => {
                    return (
                      <tr>
                        <td>
                          <div className='d-flex justify-content-start flex-column'>
                            <a href='#' className='text-gray-900 fw-bold text-hover-primary fs-6'>
                              {item.resource_name}
                            </a>
                          </div>
                        </td>
                        <td>
                          <span className='text-gray-900 fw-bold text-hover-primary d-block fs-6'>
                          {item.resource_end_client.client_name}
                          </span>
                        </td>
                        <td className='text-end'>
                          <div className='d-flex flex-column w-100 me-2'>
                            <div className='d-flex flex-stack mb-2'>
                              <span className='text-muted me-2 fs-7 fw-semibold'>{item.resourceOnboardingStatus.status_description}</span>
                            </div>
                            <div className='progress h-6px w-100'>
                              <div
                                className='progress-bar bg-primary'
                                role='progressbar'
                                style={{width: item.resourceOnboardingStatus.status_progress}}
                              ></div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className='d-flex justify-content-end flex-shrink-0'>
                            <a
                              href='#'
                              className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1'
                            >
                              <KTIcon iconName='switch' className='fs-3' />
                            </a>
                            <a
                              href='#'
                              className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1'
                            >
                              <KTIcon iconName='pencil' className='fs-3' />
                            </a>
                            <a
                              href='#'
                              className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm'
                            >
                              <KTIcon iconName='trash' className='fs-3' />
                            </a>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  </tbody>
              );
            })}
            
            {/* end::Table body */}
          </table>
          {/* end::Table */}
        </div>
        {/* end::Table container */}
      </div>
      {/* begin::Body */}
    </div>
  )
}

export {TablesWidget10}
