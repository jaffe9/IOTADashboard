import {useEffect, useRef, FC, useState} from 'react'
import ApexCharts, {ApexOptions} from 'apexcharts'
import {KTIcon, toAbsoluteUrl} from '../../../helpers'
import {getCSSVariableValue} from '../../../assets/ts/_utils'
import {Dropdown1} from '../../content/dropdown/Dropdown1'
import {useThemeMode} from '../../layout/theme-mode/ThemeModeProvider'
import { getContractExpiries } from '../../../../apiFactory/apiHelper'

type Props = {
  className: string;
  chartColor: string;
  chartHeight: string;
}

type ContractExpRecord = {
  associated_user_id : { username:string , companyName:string};
  billing_start_date : string;
  contract_end_date : string;
  contract_file_location : string;
}

const MixedWidget8: FC<Props> = ({className, chartColor, chartHeight }) => {
  const chartRef = useRef<HTMLDivElement | null>(null)
  const [ expiringContract , setExpiringRecords ] = useState<ContractExpRecord[]>([]);
  const fetchExpiringContract = async() =>{
    const records = await getContractExpiries();
    if(records){
      const today = new Date();
      const twoMonthsFromNow = new Date();
      twoMonthsFromNow.setMonth(today.getMonth() + 2)
      const filteredAndSortedRecords = records.contracts
      .filter((record : ContractExpRecord) =>{
        const expiryDate= new Date(record.contract_end_date);
        return expiryDate <= twoMonthsFromNow && expiryDate > today;
      })
      .sort((a:{contract_end_date:string | number | Date; },b:{contract_end_date:string | number | Date;}) => new Date(a.contract_end_date).getTime() -  new Date(b.contract_end_date).getTime());
      setExpiringRecords(filteredAndSortedRecords);
    }
  };
  const formatExpiryDate = (dateStr:string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB',{
      day:'2-digit',
      month:'short',
      year:'numeric',
    }).replace(/ /g, '/');
  };
  

  useEffect(() => {
    fetchExpiringContract();
  }, []);

  // To dynamically change logo of clients based on activeTab
const updatePicUrl = (associated_user_id : { username: string}) => {
  switch (associated_user_id.username){
 case 'Balasubramanian' :
        return '/media/svg/ConsultantPhotos/Bala_Pic.jpeg'
    case 'Baskar Muniyandi' :
        return '/media/svg/ConsultantPhotos/Baskar_Pic.jpg'
    case 'Hala Abukhalaf' :
        return '/media/svg/ConsultantPhotos/Hala_Pic.jpeg'
    case 'Rakesh Kumar':
        return '/media/svg/ConsultantPhotos/Rakesh_pic.png'
    case 'Sadath Khan' :
        return '/media/svg/ConsultantPhotos/Sadath_Pic.jpeg'
    case 'Samiullah Kaleemullah' :
        return '/media/svg/ConsultantPhotos/Samiullah_Pic.jpeg'
    case 'Sandeep Puppala' :
        return '/media/svg/ConsultantPhotos/Sandeep_Pic.jpeg'
    case 'Thameem Ansari' :
        return '/media/svg/ConsultantPhotos/Thameem_Pic.jpeg'
    case 'Vignesh Prakesh' :
        return '/media/svg/ConsultantPhotos/Vignesh_Pic.jpeg'
    case 'Waseem Khan' :
        return '/media/svg/ConsultantPhotos/Wasim_Pic.jpeg'
    case 'Venkata Tejesh' :
        return "/media/svg/ConsultantPhotos/Tejesh_Pic.jpeg"
    case 'Nandha Kumar' :
         return '/media/svg/ConsultantPhotos/Nandha_kumar_Ramamoorty_Pic.jpg'
    case 'Faiz Mohammed' :
         return '/media/svg/ConsultantPhotos/Faiz_Mahmood_Khan_Pic.jpg'
    case 'Vignesh Rajan' :
         return 'media/svg/ConsultantPhotos/Vignesh_Rajan_Amex.jpg'
    case 'Ahmed Elsobky' :
         return 'media/svg/ConsultantPhotos/Ahmed_Elsobkey.jpg'
    case 'Zakir Hussain' :
         return 'media/svg/ConsultantPhotos/Zakir_Hussain.jpg'
    case 'Pradeep Kumar' :
         return 'media/svg/ConsultantPhotos/Pradeep_Kumar_Pic.jpg'
    case 'Amal Al Waheed':
         return 'media/svg/ConsultantPhotos/Amal_Al_Waheed.jpeg'
    case 'Venkateshwara Reddy Y':
         return 'media/svg/ConsultantPhotos/VenkateshwaraYReddy.jpeg'
    case 'Yasmine Khaldi':
         return 'media/svg/ConsultantPhotos/Yasmine_Khaldi.jpg'
    case 'Syeda Zeba' :
         return 'public/media/svg/ConsultantPhotos/Syeda_Zeba.jpeg'
    case 'Marwa Shalot' :
         return 'media/svg/ConsultantPhotos/Marwa Pic.jpg'
    case 'John Seleb' :
         return 'media/svg/ConsultantPhotos/John Pic.jpeg'
  }
}


  return (
    <div className={`card ${className}`}>
    {/* begin::Header */}
    <div className='card-header border-0 pt-5'>
      <h3 className='card-title align-items-start flex-column'>
        <span className='card-label fw-bold fs-3 mb-1'>Expiring Contracts </span>
        <span className='text-danger mt-1 fw-semibold fs-7'>
          Upcomming Expiries
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
            {expiringContract.length > 0 ? (<table className='table table-row-dashed table-row-gray-200 align-middle gs-0 gy-4'>
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
                {expiringContract.map((record, index) => (
                  <tr key={index}>
                    <td>
                      <div className='symbol symbol-45px me-2'>
                        <span className='symbol-label'>
                        <img
                      src={updatePicUrl({username: record.associated_user_id.username})}
                      className=""
                      style={{
                        height : '60px',
                        width : '50px',
                        marginLeft : '10px',
                        border : '1px solid black',
                        borderRadius : '10px',
                        padding : '2px'
                      }}
                      alt="Image"
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
                    <td className='text-success fw-bold'>
                      {formatExpiryDate(record.billing_start_date)}
                    </td>
                    <td className='text-danger fw-bold'>
                      {formatExpiryDate(record.contract_end_date)}
                    </td>
                    <td className='text-end' style={{maxWidth:'100px'}}>
                    <span
                      className={`text-primary bold`}
                      >
                       <strong ><style 
                              className="" 
                              style={{ 
                                display: 'inline-block', 
                                whiteSpace: 'nowrap', 
                                textOverflow: 'ellipsis', 
                                overflow: 'hidden', 
                              }}>
                              <a
                              target='_blank'
                              href={`${record.contract_file_location}`}
                              >{record.contract_file_location}</a>
                            </style>  </strong>   
                                                              
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
            </table>) : ( <p className="text-gray-900 fw-bold text-hover-danger mb-1 fs-6 text-center">No Upcomming Contract Expiries ! </p>)}
            
          </div>
        </div>
      </div>
    </div>
    {/* end::Body */}
  </div>
)
}

export {MixedWidget8}
