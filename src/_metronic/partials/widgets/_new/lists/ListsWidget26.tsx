import { useState, useEffect, Fragment } from 'react';
import { KTIcon } from '../../../../helpers';
import {
  getTempUserDetails,
  movetempUserToUser,
  updateUserId,
} from '../../../../../apiFactory/apiHelper';
import axios from 'axios';
import { Modal, Button } from 'react-bootstrap';

type Props = {
  className: string;
};

type tempUserRecord = {
  fullName: string;
  id: number;
  userId: string;
};

const ListsWidget26 = ({ className }: Props) => {
  const [tempUsers, setTempUsers] = useState<tempUserRecord[]>([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedUser, setSelectedUser] = useState<tempUserRecord | null>(null);

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

  const handleConfirm = (user: tempUserRecord) => {
    setSelectedUser(user);
    setShowConfirm(true);
  };

  const handleCancel = () => {
    setSelectedUser(null);
    setShowConfirm(false);
  };

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
                <span className="text-danger"></span>
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
          <Button variant="secondary" onClick={handleCancel}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleConfirmMove}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export { ListsWidget26 };
