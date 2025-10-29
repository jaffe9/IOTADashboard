import { useState, FC, useEffect } from "react";
import { useFormik } from "formik";
import { apiHelper } from "../../../apiFactory/apiHelper";
import { checkLeaveEntitlmentExist, createLeaveEntiltlment } from "../../../apiFactory/apiHelper1";

export interface ILeaveEntitlement {
  user_id: number;
  fullName: string;
  leave_accrued_current_year: number;
  leaves_used: number;
  leave_left_current_year: number;
  year: number;
  associated_account_manager: number;
  isActive: boolean;
}

const initialValues: ILeaveEntitlement = {
  user_id: 0,
  fullName: "",
  leave_accrued_current_year: 0,
  leaves_used: 0,
  leave_left_current_year: 0,
  year: new Date().getFullYear(),
  associated_account_manager: 0,
  isActive: true,
};

let updatedLeaveEntitlement: ILeaveEntitlement = initialValues;

const CreateLeaveEntitlement: FC = () => {
  const [data, setData] = useState<ILeaveEntitlement>(updatedLeaveEntitlement);
  const [loading, setLoading] = useState(false);
  const [allUserInfo, setAllUserInfo] = useState<any[]>([]);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await apiHelper.getAllEmployees();
        // console.log("This is the response from create leave entitlements :", res)
        setAllUserInfo(res || []);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };
    fetchEmployees();
  }, []);

  const updateData = (fieldsToUpdate: Partial<ILeaveEntitlement>): void => {
    const updatedData = Object.assign(updatedLeaveEntitlement, fieldsToUpdate);
    setData(updatedData);
  };

  const handleUserChange = async (userId: number) => {
    const hasMatch = allUserInfo.find((value: any) => value.id === userId);
    if (hasMatch) {
      updateData({
        user_id: hasMatch.id,
        fullName: hasMatch.fullName,
        associated_account_manager: hasMatch.associatedAccountManager.id || 0,
      });
    }
  };

  const formik = useFormik<ILeaveEntitlement>({
    initialValues,
    onSubmit: async () => {
      setLoading(true);

      const updatedData = Object.assign(data, updatedLeaveEntitlement);
    //   console.log("This is the data from leave entitlement:", updatedData);
      setData(updatedData);

      if (
        data.user_id < 1 ||
        data.leave_accrued_current_year < 0 ||
        data.leaves_used < 0 ||
        data.leave_left_current_year < 0 ||
        !data.year
      ) {
        alert("Please fill all required fields with valid values");
        setLoading(false);
        return;
      }
      // Check if the leaves already exist for thie user 
      const exist = await checkLeaveEntitlmentExist(data.user_id,data.year);
      if (exist){
        alert(`A leave record Id for ${data.fullName} Already exist for the year ${data.year}`)
        setLoading(false)
        return;
      }
      const leaveEntitlementData : ILeaveEntitlement= {
          user_id: data.user_id,
          leave_accrued_current_year: data.leave_accrued_current_year,
          leaves_used: data.leaves_used,
          leave_left_current_year: data.leave_left_current_year,
          year: data.year,
          associated_account_manager: data.associated_account_manager,
          isActive: true,
          fullName: ""
      };

    //   console.log("Inserted Leave Entitlement:", leaveEntitlementData);
      try {
        // API is For creating a record for leave entitlements:
        const apiResponse = await createLeaveEntiltlment(leaveEntitlementData);
        if (apiResponse.status === 201) {
          alert("Leave Entitlement created successfully");
        } else {
          alert("An error occurred, please try again later");
        }
        setLoading(false);
      } catch (error) {
        console.error("Error creating leave entitlement:", error);
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
                <h3 className="fw-bolder m-0">Create Leave Entitlement</h3>
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
                      id="user_id"
                      className="form-select form-select-solid form-select-lg fw-bold"
                      onChange={async (e) => {
                        await handleUserChange(parseInt(e.target.value));
                        formik.setFieldValue("user_id", updatedLeaveEntitlement.user_id);
                        formik.setFieldValue("fullName", updatedLeaveEntitlement.fullName);
                        formik.setFieldValue(
                          "associated_account_manager",
                          updatedLeaveEntitlement.associated_account_manager
                        );
                      }}
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

                {/* Year */}
                <div className="row mb-6">
                  <label className="col-lg-4 col-form-label fw-bold fs-6 required">
                    <span>Year</span>
                  </label>
                  <div className="col-lg-8 fv-row">
                    <input
                      type="number"
                      className="form-control form-control-lg form-control-solid"
                      placeholder="Enter year"
                      defaultValue={new Date().getFullYear()}
                      onChange={(e) => {
                        updateData({ year: parseInt(e.target.value) });
                        formik.setFieldValue("year", parseInt(e.target.value));
                      }}
                    />
                  </div>
                </div>

                {/* Leave Accrued Current Year */}
                <div className="row mb-6">
                  <label className="col-lg-4 col-form-label fw-bold fs-6 required">
                    <span>Leave Accrued (Current Year)</span>
                  </label>
                  <div className="col-lg-8 fv-row">
                    <input
                      type="number"
                      step="0.5"
                      className="form-control form-control-lg form-control-solid"
                      placeholder="Enter leave accrued"
                      onChange={(e) => {
                        updateData({ leave_accrued_current_year: parseFloat(e.target.value) });
                        formik.setFieldValue(
                          "leave_accrued_current_year",
                          parseFloat(e.target.value)
                        );
                      }}
                    />
                  </div>
                </div>

                {/* Leaves Used */}
                <div className="row mb-6">
                  <label className="col-lg-4 col-form-label fw-bold fs-6 required">
                    <span>Leaves Used</span>
                  </label>
                  <div className="col-lg-8 fv-row">
                    <input
                      type="number"
                      step="0.5"
                      className="form-control form-control-lg form-control-solid"
                      placeholder="Enter leaves used"
                      onChange={(e) => {
                        updateData({ leaves_used: parseFloat(e.target.value) });
                        formik.setFieldValue("leaves_used", parseFloat(e.target.value));
                      }}
                    />
                  </div>
                </div>

                {/* Leave Left Current Year */}
                <div className="row mb-6">
                  <label className="col-lg-4 col-form-label fw-bold fs-6 required">
                    <span>Leave Left (Current Year)</span>
                  </label>
                  <div className="col-lg-8 fv-row">
                    <input
                      type="number"
                      step="0.5"
                      className="form-control form-control-lg form-control-solid"
                      placeholder="Enter leave left"
                      onChange={(e) => {
                        updateData({ leave_left_current_year: parseFloat(e.target.value) });
                        formik.setFieldValue(
                          "leave_left_current_year",
                          parseFloat(e.target.value)
                        );
                      }}
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="card-footer d-flex justify-content-end py-6 px-9">
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {!loading && "Save Leave Entitlement"}
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

export { CreateLeaveEntitlement };