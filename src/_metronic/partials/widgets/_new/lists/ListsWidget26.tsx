import { useState, useEffect, Fragment } from 'react';
import { KTIcon } from '../../../../helpers';
import { getTempUserDetails, movetempUserToUser, updateUserId } from '../../../../../apiFactory/apiHelper';
import axios from 'axios';

type Props = {
  className: string;
};


type tempUserRecord = {
  fullName: string;
  id : number;
  userId : string;
};

const ListsWidget26 = ({ className }: Props) => {
  const [tempUsers, setTempUsers] = useState<tempUserRecord[]>([]);

  // Function to fetch the temp users' details
  const tempUserRecords = async () => {
    const records = await getTempUserDetails();  // Use the correct function from the API
  
    if (records && records.data) {
      setTempUsers(records.data); // Assuming the API returns data under 'data' property
    }
  };

  // Function to move the TempUser to user = 
  const handleMoveToUser = async (user : tempUserRecord ) => {
    // Remove the userId before sending to user table
    const { id , userId , ...tempDatas } = user
    // remove userId as it is extra field
     try{
        const resuult = await movetempUserToUser(tempDatas);
        console.log("User moved successfully :" , resuult )
      // To filter the data once the id is moved
      setTempUsers((prev) => prev.filter((u) => u.id !== user.id))
         try{
          const updateData = await updateUserId(user.id)
          console.log(`updated userId ${user.id}` , updateData)
         }catch(error){
            if (axios.isAxiosError(error)){
              console.error("Error in updating userId in listwidget26 ; " , error.response?.data)
            }else{
              console.error("some other error in listwidget26 updateUser :" ,error)
            }
         }
     }catch(error){
     console.error("Error in moveToUser: " , error)
     }
  }

  useEffect(() => {
    tempUserRecords(); // Fetch the temp users on component mount
  }, []);

  return (
    <div className={`card card-flush ${className}`}>
      <div className="card-header pt-5">
        <h3 className="card-title text-gray-800 fw-bold">New Resources</h3>
        <div className="card-toolbar">Click Arrow For Permanent Joining </div>
      </div>
      <div className="card-body pt-5">
        {tempUsers.length > 0 ? (
          tempUsers.map((record, index) => (
            <Fragment key={`tempuser-${index}`}>
              <div className="d-flex flex-stack">
                <a href="#" className="text-primary fw-bold fs-6 me-2">
                  {record.fullName?.toUpperCase() || 'NO USERNAME'} {/* Display Full Name */}
                </a>
                <span className="text-danger">
                  {/* Add any other information you need, such as status or actions */}
                </span>
                <button
                  type="button"
                  className="btn btn-icon btn-sm h-auto btn-color-gray-500 btn-active-color-primary justify-content-end"
                  onClick={() => {
                    // Add the action for moving the temp user to permanent
                    handleMoveToUser(record)
                    console.log(`${record.fullName} is moved to permanent.`);
                  }}
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
    </div>
  );
};

export { ListsWidget26 };
