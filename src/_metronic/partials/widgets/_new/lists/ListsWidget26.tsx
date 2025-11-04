import { useState, useEffect, Fragment } from 'react';
import { KTIcon } from '../../../../helpers';
import {
  getTempUserDetails,
  movetempUserToUser,
  updateUserId,
} from '../../../../../apiFactory/apiHelper';
import axios from 'axios';
import { Modal, Button , Form} from 'react-bootstrap';
import { updateJoiningDate, updateJoiningStatus } from '../../../../../apiFactory/apiHelper1';

type Props = {
  className: string;
};

export type tempUserRecord = {
  fullName: string;
  employeeJoiningDate : string;
  id: number;
  userId: string;
  
};

const ListsWidget26 = ({ className }: Props) => {
  const [tempUsers, setTempUsers] = useState<tempUserRecord[]>([]);
  const [showConfirm, setShowConfirm] = useState(false); //Showing the pop up card 
  const [selectedUser, setSelectedUser] = useState<tempUserRecord | null>(null);
  // statemanagement for button 
  const [showDateModal , setShowDateModal] = useState(false);
  const [editingUser, setEditingUser]  = useState<tempUserRecord | null>(null)
  const [newJoiningDate, setNewJoiningDate] = useState('')
  const [errorMessage, setErrorMessage] = useState<any>('')
  //function to handle date click
  const handleDateClick = (user:tempUserRecord) => {
    setEditingUser(user)
    setNewJoiningDate(user.employeeJoiningDate)
    setShowDateModal(true)
  }
  // function to Open Date Model 
const handleUpdateDate = async () => {
  if (editingUser && newJoiningDate) {
    try {
      // Send the updated user object with new date
      const updatedUser = { ...editingUser, employeeJoiningDate: newJoiningDate };
      const result = await updateJoiningDate(updatedUser);
      console.log("This is the result:", result);
      
      // Update local state to reflect change
      setTempUsers((prev) =>
        prev.map((user) =>
          user.id === editingUser.id
            ? { ...user, employeeJoiningDate: newJoiningDate }
            : user
        )
      );
      
      // Close modal on success
      handleCloseDateModal();
      setErrorMessage(''); // Clear any previous errors
    } catch (error: any) {
      console.error('Error updating joining date:', error);
      // Extract error message from API response
      const message = error?.response?.data?.message || 
                     error?.message || 
                     'Failed to update joining date';
      setErrorMessage(message);
    }
  }
};

const handleCloseDateModal = () => {
  setShowDateModal(false);
  setEditingUser(null);
  setNewJoiningDate('');
  setErrorMessage(''); // Add this line
};

  // Function to fetch the temp users' details
  const tempUserRecords = async () => {
    const records = await getTempUserDetails(); // Use the correct function from the API

    if (records && records.data) {
      setTempUsers(records.data); // Assuming the API returns data under 'data' property
    }
  };

  // Function to move the TempUser to user
  const handleMoveToUser = async (user: tempUserRecord) => {
    const { id, userId, ...tempDatas } = user;
    try {
      const result = await movetempUserToUser(tempDatas);
      console.log('User moved successfully:', result);
      // To filter the data once the id is moved
      setTempUsers((prev) => prev.filter((u) => u.id !== user.id));

      try {
        const updateData = await updateUserId(user.id);
        console.log(`Updated userId ${user.id}`, updateData);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error('Error in updating userId in listwidget26:', error.response?.data);
        } else {
          console.error('Some other error in listwidget26 updateUser:', error);
        }
      }
    } catch (error) {
      console.error('Error in moveToUser:', error);
    }
  };

   const handleUpdateStatus = async (user: tempUserRecord) => {
    try{
     await updateJoiningStatus(user)
     alert(`Marked Inactive for ${user.fullName}`)
     setTempUsers((prev) => prev.filter((u) => u.id !== user.id));
    }catch(error){
      if(error){
        console.error("Error in Marking User as inactive", error)
      }else{
        console.error(" 500 - Internal Server Error ", error)
      }
    }
  };
  const handleConfirm = (user: tempUserRecord) => {
    setSelectedUser(user);
    setShowConfirm(true);
  };

  const handleCancel = () => {
    setSelectedUser(null);
    setShowConfirm(false);
  };

  const handleStatus = () => {
    if(selectedUser){
      handleUpdateStatus(selectedUser)
      setShowConfirm(false)
      setSelectedUser(null)
    }
  }

  const handleConfirmMove = () => {
    if (selectedUser) {
      handleMoveToUser(selectedUser);
      setShowConfirm(false);
      setSelectedUser(null);
    }
  };

  useEffect(() => {
    tempUserRecords(); // Fetch the temp users on component mount
  }, []);

  return (
    <div className={`card card-flush ${className}`}>
      <div className="card-header pt-5">
        <h3 className="card-title text-gray-800 fw-bold">New Resources</h3>
        <div className="card-toolbar">Click Arrow For Permanent Joining</div>
      </div>
      <div className="card-body pt-5">
        {tempUsers.length > 0 ? (
          tempUsers.map((record, index) => (
            <Fragment key={`tempuser-${index}`}>
              <div className="d-flex flex-stack">
                <a href="#" className="text-primary fw-bold fs-6 me-2">
                  {record.fullName?.toUpperCase() || 'NO USERNAME'} {/* Display Full Name */}
                </a>
                <button
                  type="button"
                  className="btn btn-link text-danger text-decoration-none p-0"
                  onClick={() => handleDateClick(record)}
                >
                  {record.employeeJoiningDate || "DATE NOT FOUND"}
                </button>
                <button
                  type="button"
                  className="btn btn-icon btn-sm h-auto btn-color-gray-500 btn-active-color-primary justify-content-end"
                  onClick={() => handleConfirm(record)}
                >
                  <KTIcon iconName="exit-right-corner" className="fs-2" />
                </button>
              </div>
              {tempUsers.length - 1 > index && (
                <div className="separator separator-dashed my-3" />
              )}
            </Fragment>
          ))
        ) : (
          <div>No Users to Move.</div>
        )}
      </div>

      {/* Confirmation Modal */}
      <Modal show={showConfirm} onHide={handleCancel} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Action</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to move
          <strong> {selectedUser?.fullName?.toUpperCase()}</strong> to a permanent user?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleStatus}>
            Mark In Active
          </Button>
          <Button variant="secondary" onClick={handleCancel}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleConfirmMove}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
      {/* Date Edit Modal */}
<Modal show={showDateModal} onHide={handleCloseDateModal} centered>
  <Modal.Header closeButton>
    <Modal.Title>Update Joining Date</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <p>
      Update joining date for <strong>{editingUser?.fullName?.toUpperCase()}</strong>
    </p>
    <Form.Group>
      <Form.Label>New Joining Date</Form.Label>
      <Form.Control
        type="date"
        value={newJoiningDate}
        onChange={(e) => setNewJoiningDate(e.target.value)}
        min={new Date().toISOString().split('T')[0]}  // Changed from toLocaleString()
      />
    </Form.Group>
    {errorMessage && <div className="text-danger mt-2">{errorMessage}</div>}
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={handleCloseDateModal}>
      Cancel
    </Button>
    <Button variant="primary" onClick={handleUpdateDate} disabled={!newJoiningDate}>
      Update
    </Button>
  </Modal.Footer>
</Modal>
    </div>
  );
};

export { ListsWidget26 };
