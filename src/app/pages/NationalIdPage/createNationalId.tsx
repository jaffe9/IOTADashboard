import { useState, FC, useEffect } from "react";
import { useFormik } from "formik";
import { checkNationalIdExist, createNationalId, getMissingNationalId } from "../../../apiFactory/apiHelper1";

// Define the interface for National ID Info
export interface INationalIdInfo {
  associated_user_id: number;
  associatedAccountManager: number;
  fullName: string;
  national_id: string;
  expiry_date: string;
}

// Initial values - export this to your models file
export const nationalIdInfoInitialValues: INationalIdInfo = {
  associated_user_id: 0,
  associatedAccountManager: 0,
  fullName: "",
  national_id: "",
  expiry_date: "",
};

let updatedNationalIdInfo: INationalIdInfo = nationalIdInfoInitialValues;

const CreateNationalIdInfo: FC = () => {
  const [data, setData] = useState<INationalIdInfo>(updatedNationalIdInfo);
  const [loading, setLoading] = useState(false);
  const [allUserInfo, setAllUserInfo] = useState<any[]>([]);

  useEffect(() => {
    const fetchUsersWithoutNationalId = async () => {
      try {
       const response = await getMissingNationalId()
        
        setAllUserInfo(response.getUsersForId || []);
      } catch (error) {
        console.error("Error fetching users without national ID:", error);
      }
    };
    fetchUsersWithoutNationalId();
  }, []);

  const updateData = (fieldsToUpdate: Partial<INationalIdInfo>): void => {
    const updatedData = Object.assign(updatedNationalIdInfo, fieldsToUpdate);
    setData(updatedData);
  };

  const handleUserChange = async (userId: number) => {
    const hasMatch = allUserInfo.find((value: any) => value.id === userId);
    if (hasMatch) {
      updateData({
        associated_user_id: hasMatch.id,
        associatedAccountManager: hasMatch.associatedAccountManager,
        fullName: hasMatch.fullName,
      });
    }
  };

  const formik = useFormik<INationalIdInfo>({
    initialValues: nationalIdInfoInitialValues,
    onSubmit: async () => {
      setLoading(true);

      const updatedData = Object.assign(data, updatedNationalIdInfo);
      console.log("This is the data from national ID info:", updatedData);
      setData(updatedData);

      if (data.associated_user_id < 1 || !data.national_id || !data.expiry_date) {
        alert("Please fill all required fields");
        setLoading(false);
        return;
      }

      // Validate national ID format (adjust regex as needed)
      if (!/^[0-9]{10}$/.test(data.national_id)) {
        alert("National ID must be 10 digits");
        setLoading(false);
        return;
      }

      // Check if expiry date is in the future
      const expiryDate = new Date(data.expiry_date);
      const today = new Date();
      if (expiryDate <= today) {
        alert("Expiry date must be in the future");
        setLoading(false);
        return;
      }

    //   Check if national ID already exists for this user
      const exists = await checkNationalIdExist(data.associated_user_id);
      if (exists) {
        alert(`A national ID for ${data.fullName} already exists. Please check existing records.`);
        setLoading(false);
        return;
      }

      const nationalIdData: INationalIdInfo = {
        associated_user_id: data.associated_user_id,
        associatedAccountManager: data.associatedAccountManager,
        fullName: data.fullName,
        national_id: data.national_id,
        expiry_date: data.expiry_date,
      };

      console.log("Inserted National ID Info:", nationalIdData);


      const apiResponse = await createNationalId(nationalIdData);

      if (apiResponse.status === 201) {
        alert("National ID information created successfully");
        setLoading(false);
        // Reset form
        formik.resetForm();
        setData(nationalIdInfoInitialValues);
        updatedNationalIdInfo = nationalIdInfoInitialValues;
      } else {
        alert("An error occurred, please try again later");
        setLoading(false);
      }
    },
  });

  return (
    <div className="card mb-12">
      <div className="form">
        <div className="card-body">
          <div className="card mb-12 mb-xl-12">
            <div className="card-header border-0 cursor-pointer">
              <div className="card-title m-0">
                <h3 className="fw-bolder m-0">Create National ID Information</h3>
              </div>
            </div>

            <div className="card-body border-top p-9">
              <form onSubmit={formik.handleSubmit} noValidate className="form">
                {/* User Name */}
                <div className="row mb-6">
                  <label className="col-lg-4 col-form-label fw-bold fs-6 required">
                    <span>User Name</span>
                  </label>
                  <div className="col-lg-8 fv-row">
                    <select
                      id="associated_user_id"
                      className="form-select form-select-solid form-select-lg fw-bold"
                      onChange={async (e) => {
                        await handleUserChange(parseInt(e.target.value));
                        formik.setFieldValue("associated_user_id", updatedNationalIdInfo.associated_user_id);
                        formik.setFieldValue("associatedAccountManager", updatedNationalIdInfo.associatedAccountManager);
                        formik.setFieldValue("fullName", updatedNationalIdInfo.fullName);
                      }}
                      value={formik.values.associated_user_id || ""}
                    >
                      <option value="">Select User</option>
                      {allUserInfo.map((user: any, i: number) => (
                        <option key={i} value={user.id}>
                          {user.fullName}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Show Account Manager ID if user is selected */}
                {data.associatedAccountManager > 0 && (
                  <div className="row mb-6">
                    <label className="col-lg-4 col-form-label fw-bold fs-6">
                      <span>Account Manager ID</span>
                    </label>
                    <div className="col-lg-8 fv-row">
                      <input
                        type="text"
                        className="form-control form-control-lg form-control-solid"
                        value={data.associatedAccountManager}
                        disabled
                      />
                    </div>
                  </div>
                )}

                {/* National ID */}
                <div className="row mb-6">
                  <label className="col-lg-4 col-form-label fw-bold fs-6 required">
                    <span>National ID</span>
                  </label>
                  <div className="col-lg-8 fv-row">
                    <input
                      type="text"
                      className="form-control form-control-lg form-control-solid"
                      placeholder="Enter national ID number"
                      onChange={(e) => {
                        updateData({ national_id: e.target.value });
                        formik.setFieldValue("national_id", e.target.value);
                      }}
                      value={formik.values.national_id}
                    />
                  </div>
                </div>

                {/* Expiry Date */}
                <div className="row mb-6">
                  <label className="col-lg-4 col-form-label fw-bold fs-6 required">
                    <span>Expiry Date</span>
                  </label>
                  <div className="col-lg-8 fv-row">
                    <input
                      type="date"
                      className="form-control form-control-lg form-control-solid"
                      onChange={(e) => {
                        updateData({ expiry_date: e.target.value });
                        formik.setFieldValue("expiry_date", e.target.value);
                      }}
                      value={formik.values.expiry_date}
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="card-footer d-flex justify-content-end py-6 px-9">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {!loading && "Save National ID Info"}
                    {loading && (
                      <span className="indicator-progress" style={{ display: "block" }}>
                        Please wait...
                        <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
                      </span>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { CreateNationalIdInfo };