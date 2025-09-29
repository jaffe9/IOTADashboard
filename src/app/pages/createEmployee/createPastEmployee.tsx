import { useState } from "react";
import { apiHelper, createPastEmployee, uploadClearanceToSupabase, uploadNoDueToSupabase } from "../../../apiFactory/apiHelper";
import {
  IProfilePastEmployees,
  profileDetailsPastEmployees as initialValues,
} from "../../modules/accounts/components/settings/SettingsModel";
import { useFormik } from "formik";
import { PastUser, User } from "../../modules/apps/user-management/users-list/core/_models";

var allUserInfo: any = await apiHelper.getAllEmployees().then(async (data) => {
  return data;
});
console.log("this is form create employee : " ,allUserInfo)
let updatedPastEmployee: IProfilePastEmployees = initialValues;

const CreatePastEmployee: React.FC = () => {
  const [data, setData] = useState<IProfilePastEmployees>(updatedPastEmployee);
  const [file, setFile] = useState(null);
  const [clearanceFile, setClearanceFile] = useState<File | null>(null);
  const [noDueFile, setNoDueFile] = useState<File | null>(null); 

  const updateData = (fieldsToUpdate: Partial<IProfilePastEmployees>): void => {
    const updatedData = Object.assign(updatedPastEmployee, fieldsToUpdate);
    setData(updatedData);
  };

  const handleUserChange = async (associatedUserId: number) => {
    const hasMatch = allUserInfo.find((value: User) => value.id === associatedUserId);
    updateData({
      associatedUserId: hasMatch.id,
      fullName: hasMatch.fullName,
      employeeJoiningDate: hasMatch.employeeJoiningDate,
      client_id: hasMatch.client_id,
    });
    // set values automatically when the associatedUserId is selected 
      formik.setFieldValue("associatedUserId", hasMatch.id);
      formik.setFieldValue("fullName", hasMatch.fullName);
      formik.setFieldValue("employeeJoiningDate", hasMatch.employeeJoiningDate);
      formik.setFieldValue("client_id", hasMatch.client_id);
  };

  const [loading, setLoading] = useState(false);

  const handleFileChange = (event: any) => {
    setFile(event.target.files[0]);
  };

  const handleUploadClearance = async () => {
    if (!file) {
      alert("Please select the Clearance Letter");
      return;
    }
    try {
      await uploadClearanceToSupabase(file);
      alert("Clearance File Uploaded Successfully!");
    } catch (error) {
      console.error("Error uploading clearance file:", error);
    }
  };

  const formik = useFormik<IProfilePastEmployees>({
    initialValues,
    onSubmit: async () => {
      setLoading(true);
      setTimeout(async () => {
        const updatedData = Object.assign(data, updatedPastEmployee);
        setData(updatedData);

        if (data.client_id < 1 || data.associatedUserId == null) {
          alert("Please Select all the fields");
          setLoading(false);
          return;
        }
      });

        let clearanceUrl: string | null = null;
        let noDueUrl: string | null = null;

        if (clearanceFile) {
            clearanceUrl = await uploadClearanceToSupabase(clearanceFile);
            if (!clearanceUrl) {
            alert("Clearance Letter upload failed");
            setLoading(false);
            return;
            }
        }

        if (noDueFile) {
            noDueUrl = await uploadNoDueToSupabase(noDueFile);
            if (!noDueUrl) {
            alert("NoDue document upload failed");
            setLoading(false);
            return;
            }
        }

        const pastEmployee: PastUser = {
            associatedUserId: data.associatedUserId,
            fullName: data.fullName,
            employeeJoiningDate: data.employeeJoiningDate,
            employeeExitDate: data.employeeExitDate,
            clearanceLetter: clearanceUrl,
            noDueLetter: noDueUrl,
            client_id: data.client_id,
        };

        console.log("Inserted PastEmployee Data :", pastEmployee);
        const apiResponse = await createPastEmployee(pastEmployee);

        if (apiResponse.status === 201) {
            alert("Past Employee created successfully");
        } else {
            alert("An error occurred, please try again later");
        }
        setLoading(false);
        }
  });

  return (
    <div>
      <div className="form">
        <div className="card mb-12 mb-xl-12">
          <div className="card-header border-0 cursor-pointer" role="button">
            <h3 className="fw-bolder m-0">Create Past Employee</h3>
          </div>
          <div className="card-body border-top p-9">
            <form onSubmit={formik.handleSubmit} noValidate className="form">
              <div className="row mb-6">
                <label className="col-lg-4 col-form-label fw-bold fs-6">Employee Name</label>
                <div className="col-lg-8 fv-row">
                  <select
                    className="form-control form-control-lg form-control-solid"
                    onChange={(e) => handleUserChange(parseInt(e.target.value))}
                  >
                    <option value="">Select Employee</option>
                    {allUserInfo.map((user: User, index: number) => (
                      <option key={index} value={user.id}>
                        {user.fullName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Other fields as read-only */}
              <div className="row mb-6">
                <label className="col-lg-4 col-form-label fw-bold fs-6">Full Name</label>
                <div className="col-lg-8 fv-row">
                  <input
                    type="text"
                    className="form-control form-control-lg form-control-solid"
                    value={data.fullName || ""}
                    readOnly
                  />
                </div>
              </div>

              <div className="row mb-6">
                <label className="col-lg-4 col-form-label fw-bold fs-6">Client ID</label>
                <div className="col-lg-8 fv-row">
                  <input
                    type="text"
                    className="form-control form-control-lg form-control-solid"
                    value={data.client_id || ""}
                    readOnly
                  />
                </div>
              </div>

              <div className="row mb-6">
                <label className="col-lg-4 col-form-label fw-bold fs-6">Employee Joining Date</label>
                <div className="col-lg-8 fv-row">
                  <input
                    type="text"
                    className="form-control form-control-lg form-control-solid"
                    value={data.employeeJoiningDate || ""}
                    readOnly
                  />
                </div>
              </div>

              {/* Manual input fields */}
              <div className="row mb-6">
                <label className="col-lg-4 col-form-label fw-bold fs-6">Employee Exit Date</label>
                <div className="col-lg-8 fv-row">
                  <input
                    type="date"
                    className="form-control form-control-lg form-control-solid"
                    onChange={(e) => updateData({ employeeExitDate: e.target.value })}
                  />
                </div>
              </div>

              <div className="row mb-6">
                <label className="col-lg-4 col-form-label fw-bold fs-6">Clearance Letter</label>
                <div className="col-lg-8 fv-row">
                  <input
                   type="file"
                    className="form-control form-control-lg form-control-solid"
                    onChange={(e) => setClearanceFile(e.target.files?.[0] || null)}
                  />
                </div>
              </div>

              <div className="row mb-6">
                <label className="col-lg-4 col-form-label fw-bold fs-6">No Due Letter</label>
                <div className="col-lg-8 fv-row">
                  <input
                    type="file"
                    className="form-control form-control-lg form-control-solid"
                    onChange={(e) => setNoDueFile(e.target.files?.[0] || null)}
                  />
                </div>
              </div>

              <div className="card-footer d-flex justify-content-end py-6 px-9">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {!loading && "Save Changes"}
                  {loading && (
                    <span className="indicator-progress" style={{ display: "block" }}>
                      Please wait...{" "}
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
  );
};

export { CreatePastEmployee };
