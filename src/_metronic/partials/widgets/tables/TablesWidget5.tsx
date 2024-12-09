
import { FC, useEffect, useState } from 'react'
import {KTIcon, toAbsoluteUrl} from '../../../helpers'
import { getNationalIdExp } from '../../../../apiFactory/apiHelper';
import { error } from 'console';

type Props = {
  className: string
}

type NationalIdRecord = {
  national_id: string;
  expiry_date: string;
  associated_user_id: { username: string,companyName:string };
};

const TablesWidget5 = ({ className }: Props) => {
  const [expiringRecords, setExpiringRecords] = useState<NationalIdRecord[]>([]);

  const fetchExpiringRecords = async () => {
    const records = await getNationalIdExp();

    if (records) {
      const today = new Date();
      const twoMonthsFromNow = new Date();
      twoMonthsFromNow.setMonth(today.getMonth() + 2);

      const filteredAndSortedRecords = records
        .filter((record: NationalIdRecord) => {
          const expiryDate = new Date(record.expiry_date);
          return expiryDate <= twoMonthsFromNow && expiryDate > today;
        })
        .sort((a: { expiry_date: string | number | Date; }, b: { expiry_date: string | number | Date; }) => new Date(a.expiry_date).getTime() - new Date(b.expiry_date).getTime());

      setExpiringRecords(filteredAndSortedRecords);
    }
  };

  const formatExpiryDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).replace(/ /g, '/');
  };

  useEffect(() => {
    fetchExpiringRecords();
  }, []);


  return (
    <div className={`card ${className}`}>
      {/* begin::Header */}
      <div className='card-header border-0 pt-5'>
        <h3 className='card-title align-items-start flex-column'>
          <span className='card-label fw-bold fs-3 mb-1'>National ID </span>
          <span className='text-danger mt-1 fw-semibold fs-7'>
            Upcomming Expiring ID's
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
                
              </a>
            </li>
            <li className='nav-item'>
              <a
                className='nav-link btn btn-sm btn-color-muted btn-active btn-active-light-primary fw-bold px-4 me-1'
                data-bs-toggle='tab'
                href='#kt_table_widget_5_tab_2'
              >
                
              </a>
            </li>
            <li className='nav-item'>
              <a
                className='nav-link btn btn-sm btn-color-muted btn-active btn-active-light-primary fw-bold px-4'
                data-bs-toggle='tab'
                href='#kt_table_widget_5_tab_3'
              >
                
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
                <thead>
                  <tr className='border-0'>
                    <th className='p-0 w-50px'></th>
                    <th className='p-0 min-w-150px'></th>
                    <th className='p-0 min-w-140px'></th>
                    <th className='p-0 min-w-110px'></th>
                    <th className='p-0 min-w-50px'></th>
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
                              alt=''
                            />
                          </span>
                        </div>
                      </td>
                      <td>
                        <a
                          href='#'
                          className='text-gray-900 fw-bold text-hover-primary mb-1 fs-6'
                        >
                          {record.associated_user_id.username.toUpperCase()}
                        </a>
                        <span className='text-muted fw-semibold d-block'>
                        {record.associated_user_id.companyName.toUpperCase()}
                        </span>
                      </td>
                      <td className='text-danger fw-bold'>
                        {formatExpiryDate(record.expiry_date)}
                      </td>
                      <td className='text-end'>
                      <span
                        className={`text-primary bold`}
                        >
                         <strong >{record.national_id} </strong>   
                                                                
                        </span>
                      </td>
                      <td className='text-end'>
                        <a
                          href='#'
                          className='btn btn-sm btn-icon btn-bg-light btn-active-color-primary'
                        >
                          <KTIcon iconName='arrow-right' className='fs-2' />
                        </a>
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
  )
}

export {TablesWidget5}
