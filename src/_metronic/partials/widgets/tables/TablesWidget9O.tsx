
import React, { useState, useEffect } from 'react'
import { KTIcon, toAbsoluteUrl } from '../../../helpers'
import { apiHelper } from '../../../../apiFactory/apiHelper'
import { json } from 'stream/consumers'
type Props = 
{
  className: string
}

const fetchData = async () => {
  try 
  {
    const response = await apiHelper.getAllOpportunities();
    return response;
  } catch (error) 
  {
    console.error("Error fetching data:", error);
  }
};


const today = new Date()
let apiresponse:any = null;
let varDate: string = today.toLocaleString('en-GB', {day: 'numeric', month: 'short', year: 'numeric'}).replace(/ /g, '-');
let data = fetchData();
await data.then(function(result: any)
{
  apiresponse = result;
});
const TablesWidget9O: React.FC<Props> = ({className}) => {
  
  useEffect(() => 
    {
      apiresponse = JSON.parse(JSON.stringify(apiresponse))
    }, []);
//apiresponse.data[0].id
  return (
    <div className={`card ${className}`}>
      {/* begin::Header */}
      <div className='card-header border-0 pt-5'>
        <h3 className='card-title align-items-start flex-column'>
          <span className='card-label fw-bold fs-3 mb-1'>List of Opportunities</span>
          <span className='text-muted mt-1 fw-semibold fs-7'>As of {varDate}</span>
        </h3>
        <div
          className='card-toolbar'
          data-bs-toggle='tooltip'
          data-bs-placement='top'
          data-bs-trigger='hover'
          title='Click to add a new opportunity'
        >
          <a
            href='#'
            className='btn btn-sm btn-light-primary'
            data-bs-toggle='modal'
            data-bs-target='#kt_modal_invite_friends'
          >
            <KTIcon iconName='plus' className='fs-3' />
            Register Opportunity
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
                <th className='w-25px'>
                  <div className='form-check form-check-sm form-check-custom form-check-solid'>
                    <input
                      className='form-check-input'
                      type='checkbox'
                      value='1'
                      data-kt-check='true'
                      data-kt-check-target='.widget-9-check'
                    />
                  </div>
                </th>
                <th className='min-w-150px'>Opportunity</th>
                <th className='min-w-140px'>Customer</th>
                <th className='min-w-120px'>Progress</th>
                <th className='min-w-100px text-end'>Actions</th>
              </tr>
            </thead>
            {/* end::Table head */}
            {/* begin::Table body */}
            <tbody>
              {apiresponse.data && apiresponse.data.map && apiresponse.data.map((value : any, index: number) => {
              return <tr key={index}>
              <td>
                <div className='form-check form-check-sm form-check-custom form-check-solid'>
                  <input className='form-check-input widget-9-check' type='checkbox' value='1' />
                </div>
              </td>
              <td>
                <div className='d-flex align-items-center'>
                  <div className='d-flex justify-content-start flex-column'>
                    <a href='#' className='text-gray-900 fw-bold text-hover-primary fs-6'>
                      {value.opportunity_description}
                    </a>
                    <span className='text-muted fw-semibold text-muted d-block fs-7'>
                      {value.opportunity_client_manager}
                    </span>
                  </div>
                </div>
              </td>
              <td>
                <a href='#' className='text-gray-900 fw-bold text-hover-primary d-block fs-6'>
                  {value.clients.client_name}
                </a>
                <span className='text-muted fw-semibold text-muted d-block fs-7'>
                  {value.opportunity_iwt_owner}
                </span>
              </td>
              <td className='text-end'>
                <div className='d-flex flex-column w-100 me-2'>
                  <div className='d-flex flex-stack mb-2'>
                    <span className='text-muted me-2 fs-7 fw-semibold'>{value.opportunityStatus.status_description}</span>
                  </div>
                  <div className='progress h-6px w-100'>
                    <div
                      className='progress-bar bg-primary'
                      role='progressbar'
                      style={{width: '50%'}}
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
              })}
            </tbody>
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

// *********************************************** Changes for API value begins here ***********************************************
//let userCountValue = document.getElementById("userCountValueTag");

    //totalOpportunitiesValue.innerHTML = response.data.length;

export {TablesWidget9O}