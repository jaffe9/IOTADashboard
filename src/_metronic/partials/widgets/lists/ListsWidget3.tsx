
import React, { Fragment, useEffect, useState } from 'react'
import {KTIcon, toAbsoluteUrl} from '../../../helpers'
import {Dropdown1} from '../../content/dropdown/Dropdown1'
import { getLeavesLeft, updateLeaveRecord } from '../../../../apiFactory/apiHelper'
import { numeric } from '@form-validation/bundle/popular'
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios'
import { Value } from 'sass'
type Props = {
  className: string
}

type LeaveBalanceRecord = {
  id: number;
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
  const [ showConfirm , setShowConfirm ] = useState(false) // Show pop up card to confirm 
  const [ selectedUser , setSelectedUser ] = useState<LeaveBalanceRecord | null>(null)
  const [updatedLeaves , setUpdatedLeaves ] = useState({
    leaves_used: 0,
    leave_left_current_year: 0,
  }) 

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



  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUpdatedLeaves((prevState) => ({
      ...prevState,
      [name]: value ? parseInt(value) : 0, // Ensure it's a number
    }));
  };

  const handleUpdateLeaveRecoreStatus = async (user : LeaveBalanceRecord | null) => {
    if(!user) return ;

    // Adding validation to the fields 
    if (updatedLeaves.leaves_used === null || updatedLeaves.leave_left_current_year === null ){
       alert("Please fill in both the fields before confirm")
       return ;
    }
    try {
      const result = await updateLeaveRecord(user.id , updatedLeaves)
      console.log("Updated Leave Record in ListWidget 3:" , result)
      alert(`Updated Leave Record Of ${user?.user_id?.username} For The Year ${ user?.year }`)
      handleCloseModel();
      fetchLeaveBalance(); // Refresh the data 
    }catch(error){
     if(axios.isAxiosError(error)){
      console.error("Error in Leave Record Listwidget 3 Line 58 : ", error.response?.data || error.message )
     }else{
      console.error("Internal Server Error :" , error)
     }
    }
  }



  // Handle Tab Click
  const handleTabClick = (year: number) => {
    setActiveTab(year);
    setFilteredRecords(expiringRecords.filter((record) => record.year === year));
  };

  const handleOpenModal = ( user : LeaveBalanceRecord) => {
    setSelectedUser(user);
    setShowConfirm(true)
  }

  const handleCloseModel= () =>{
    setSelectedUser(null)
    setShowConfirm(false)
  }

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
            {renderTable(filteredRecords , handleOpenModal)}
          </div>
          <div
            className={`tab-pane fade ${activeTab === 2025 ? 'show active' : ''}`}
          >
            {renderTable(filteredRecords , handleOpenModal)}
          </div>
          <div className="tab-pane fade" id="kt_table_widget_5_tab_3">
            {/* Tab 3 content (if applicable) */}
          </div>
        </div>
      </div>
      <Modal show={showConfirm} onHide={handleCloseModel} centered>
        <Modal.Header closeButton>
          <Modal.Title> {`Edit Leaves For The Year ${selectedUser?.year}`} </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control 
               type="text"
               name="field1"
               value={selectedUser?.user_id?.username || "User Not Found "}
               readOnly  />
            </Form.Group>

            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Leaves Used </Form.Label>
                  <Form.Control 
                  type="number" 
                  name="field2"
                  value={selectedUser?.leaves_used ?? 0} 
                  readOnly />
                </Form.Group>
              </div>

             <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label className='required'>Update Leaves Used</Form.Label>
                  <Form.Control
                  type="number" 
                  name="leaves_used" 
                  onChange={handleInputChange}
                  isInvalid={ onchange === null}
                  />
                  <Form.Control.Feedback type='invalid'>Update Leaves Used is Required</Form.Control.Feedback>
                </Form.Group>
              </div>
            </div>
            
            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Leaves Left </Form.Label>
                  <Form.Control 
                  type="number" 
                  name="field2"
                  value={selectedUser?.leave_left_current_year ?? 0} 
                  readOnly />
                </Form.Group>
              </div>

             <div className="col-md-6 ">
                <Form.Group className="mb-3">
                  <Form.Label className='required'>Update Leaves Left</Form.Label>
                  <Form.Control
                  type="number" 
                  name="leave_left_current_year" 
                  onChange={handleInputChange}
                  isInvalid={ onchange === null}
                  />
                  <Form.Control.Feedback type='invalid'>Update Leaves Left is Required</Form.Control.Feedback>
                </Form.Group>
              </div>
            </div>

          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button  variant="secondary"  onClick={handleCloseModel} >Cancel</Button>
          <Button  variant="primary" onClick={() => handleUpdateLeaveRecoreStatus(selectedUser)}>Confirm</Button>
        </Modal.Footer>
      </Modal>

    </div>
  );
};

// Helper Function to Render Table
const renderTable = (records: LeaveBalanceRecord[] , handleOpenModal: any  ) => {
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
            <th className="px-px min-w-50px">Update</th>
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
              <th className="text-primary fw-bold">
                  <button 
                   className="btn btn-icon  h-auto btn-color-black-900 btn-active-color-primary  justify-content-center"
                   onClick={() => handleOpenModal(record)}
                  >  
                    <KTIcon iconName="dots-square" className="fs-1"/>
                  </button>
                </th>
            </tr>
          ))}
        </tbody>
      </table>


      
    </div>
  );
};


export { ListsWidget3 };
