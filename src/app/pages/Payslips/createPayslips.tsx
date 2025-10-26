import { useState, FC, useEffect } from "react";
import { useFormik } from "formik";

import { IProfileDetailsPayslips, profileDetailsPayslips as initialValues } from "../../modules/accounts/components/settings/SettingsModel";
import { checkPayslipExist, createPayslip, uploadPayslipsToSupabase } from "../../../apiFactory/apiHelper1";
import { apiHelper,getAllEmployees } from "../../../apiFactory/apiHelper";

// var allUserInfo: any = await apiHelper.getAllEmployees().then((data) => data.data);


let updatedPayslips: IProfileDetailsPayslips = initialValues;

const CreatePayslip: FC = () => {
  const [data, setData] = useState<IProfileDetailsPayslips>(updatedPayslips);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [allUserInfo, setAllUserInfo] = useState<any[]>([]);


useEffect(() => {
  const fetchEmployees = async () => {
    try {
      const res = await apiHelper.getAllEmployees();
    //   console.log("Fetched employees:", res[0]);
      setAllUserInfo(res || []);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };
  fetchEmployees();
}, []);

  const updateData = (fieldsToUpdate: Partial<IProfileDetailsPayslips>): void => {
    const updatedData = Object.assign(updatedPayslips, fieldsToUpdate);
    setData(updatedData);
  };

  const handleUserChange = async (userId: number) => {
    const hasMatch = allUserInfo.find((value: any) => value.id === userId);
    updateData({ associatedUserId: hasMatch.id ,
       fullName : hasMatch.fullName,
    });
  };

  const handleFileChange = (event: any) => {
    setFile(event.target.files[0]);
  };

  // const handleUpload = async () => {
  //   if (!file) {
  //     alert("Please select a payslip file");
  //     return;
  //   }

  //   try {
  //     const payslipUrl = await uploadPayslipsToSupabase(file);
  //     if (!payslipUrl) {
  //       alert("Payslip upload failed");
  //       return;
  //     }
  //     updateData({ paySlipLink: payslipUrl });
  //     alert("Payslip uploaded successfully");
  //   } catch (error) {
  //     console.error("Error uploading payslip:", error);
  //     alert("Error uploading payslip");
  //   }
  // };

  const formik = useFormik<IProfileDetailsPayslips>({
    initialValues,
    onSubmit: async () => {
      setLoading(true);
      // setTimeout(async () => {
        const updatedData = Object.assign(data, updatedPayslips);
        console.log("This is the data from payslip :", updatedData)
        setData(updatedData);

        if (data.associatedUserId < 1  || !data.monthYear) { //|| !data.paySlipLink
          alert("Please fill all required fields");
          setLoading(false);
          return;
        }

        // Add file check separately
        if (!file) {
          alert("Please upload a payslip file");
          setLoading(false);
          return;
        }

      const exists = await checkPayslipExist(data.associatedUserId,data.monthYear);
      console.log("This is data form exits :" , exists)
      if (exists) {
            alert(`A payslip for ${data.fullName} already exists for ${data.monthYear}. Please check existing records.`);
            setLoading(false);
            return;
        }

          let paySlipUrl: null | string = null;
          if (file) {
            paySlipUrl = await uploadPayslipsToSupabase(file);
            if (!paySlipUrl) {
              alert("PaySlip upload failed");
              setLoading(false);
              return;
            }
          } else {
            alert("Please upload a payslip file");
            setLoading(false);
            return;
          }
       
        const payslipData: IProfileDetailsPayslips = {
          fullName : data.fullName,
          associatedUserId: data.associatedUserId,
          paySlipLink: paySlipUrl,
          monthYear: data.monthYear,
        };

        console.log("Inserted Payslip:", payslipData);

        const apiResponse = await createPayslip(payslipData);

        if (apiResponse.status === 201) {
          alert("Payslip created successfully");
          setLoading(false);
        } else {
          alert("An error occurred, please try again later");
          setLoading(false);
        }
      // }, 1000);
    },
  });

  return (
    <div className="card mb-12">
      <div className="form">
        <div className="card-body">
          <div className="card mb-12 mb-xl-12">
            <div className="card-header border-0 cursor-pointer">
              <div className="card-title m-0">
                <h3 className="fw-bolder m-0">Create Payslip</h3>
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
                      id="associatedUserId"
                      className="form-select form-select-solid form-select-lg fw-bold"
                      onChange={async (e) => {
                        await handleUserChange(parseInt(e.target.value));
                        formik.setFieldValue("associatedUserId", updatedPayslips.associatedUserId);
                        formik.setFieldValue("fullName", updatedPayslips.fullName)
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

                {/* Month / Year */}
                <div className="row mb-6">
                  <label className="col-lg-4 col-form-label fw-bold fs-6 required">
                    <span>Month / Year</span>
                  </label>
                  <div className="col-lg-8 fv-row">
                    <input
                      type="month"
                      className="form-control form-control-lg form-control-solid"
                      onChange={(e) => {
                        const [year,month] = e.target.value.split("-");
                        const date = new Date(Number(year), Number(month)-1);
                        const formatted_date = date.toLocaleString("en-US", {month : "short", year : "numeric"});
                        updateData({monthYear : formatted_date})
                        formik.setFieldValue("monthYear", formatted_date);
                      }}
                    />
                  </div>
                </div>

                {/* File Upload */}
                <div className="row mb-6">
                  <label className="col-lg-4 col-form-label fw-bold fs-6">
                    Upload Payslip
                  </label>
                  <div className="col-lg-8 fv-row">
                    <div className="input-group">
                      <input
                        type="file"
                        className="form-control form-control-lg form-control-solid"
                        onChange={handleFileChange}
                      />
                      {/* <span
                        className="input-group-badge badge badge-success cursor-pointer"
                        onClick={handleUpload}
                      >
                        Click To Upload
                      </span> */}
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="card-footer d-flex justify-content-end py-6 px-9">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                    // onClick={handleUpload}
                  >
                    {!loading && "Save Payslip"}
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

export { CreatePayslip };
