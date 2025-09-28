import { useState, FC } from "react";
import { useFormik } from "formik";
import {  apiHelper,createProposal, uploadProposalToSupabase } from "../../../apiFactory/apiHelper"; // Create proposal API
import {IProfileDetailsProposals, profileDetailsProposals as initialValues} from "../../modules/accounts/components/settings/SettingsModel"
import { object } from "yup";
import { clients, Proposal } from "../../modules/apps/user-management/users-list/core/_models";



var allUserInfo: any = await apiHelper.getClientDetails().then(async (data) => {
  return data.data;
});

let updatedProposal : IProfileDetailsProposals = initialValues

const CreateProposal: FC = () => {
  const [data, setData] = useState<IProfileDetailsProposals>(updatedProposal)
   const [file,setFile] = useState(null)
  const updateData = (fieldsToUpdate:Partial<IProfileDetailsProposals>): void => {
    const updatedData = Object.assign(updatedProposal,fieldsToUpdate);
    setData(updatedData)
  }
  const handleClientChange = async (clientId : number) => {
      var hasMatch = allUserInfo.find(function (value : clients){
        return value.id == clientId;
  });
  updateData({
    clientId : hasMatch.id,
  })
}
  const [loading, setLoading] = useState(false);

    const handleFileChange = (event:any ) =>{
      setFile(event.target.files[0])
    }
    const handleUpload = async() =>{
      if(!file){
        alert("Please Select Invoice")
        return ;
      }
      try{
       await uploadProposalToSupabase(file)
       alert('Proposal Uploaded')
      }catch(error){
       console.error("Error Uploading Invoice:",error)
      }
    }

  const formik = useFormik<IProfileDetailsProposals>({
    initialValues,
 onSubmit:async () => {
      setLoading(true);
      setTimeout(async () => {
        const updatedData = Object.assign(data, updatedProposal);
        setData(updatedData);
        if(data.clientId < 1 || data.resourceName == null || data.billingAnnually == null || data.billingMonths == null || data.designation == null || data.version == null )
        {
          alert("Please select all fields")
          setLoading(false)
          return
        }

        let proposalUrl: string | null = null;
        
          if (file) {
            proposalUrl = await uploadProposalToSupabase(file);
             if (!proposalUrl) {
              alert("Proposal upload failed");
              setLoading(false);
              return;
             }
         }
        const Proposal : Proposal = {
            id : 0,
            clientId: data.clientId,
            resourceName: data.resourceName,
            billingAnnually: data.billingAnnually,
            billingMonths: data.billingMonths,
            version: data.version,
            status: 'pending',
            url: proposalUrl,
            designation: data.designation
        };
        console.log("Inserted Proposal:" , Proposal)
        const apiResponse = await createProposal(Proposal)
      
        if (apiResponse.status === 201)
          {
            alert("Proposal created  Successful");
            setLoading(false);
          }
          else
          {
            alert("An error occurred, please try again later");
            setLoading(false);
          }
      }, 1000);
    },
  });

  return (
    <div className="card mb-12">
      <div className="form">
        <div className="card-body">
          <div className="card mb-12 mb-xl-12">
            <div className="card-header border-0 cursor-pointer">
              <div className="card-title m-0">
                <h3 className="fw-bolder m-0">Create Proposal</h3>
              </div>
            </div>

            <div className="card-body border-top p-9">
              <form onSubmit={formik.handleSubmit} noValidate className="form">
                
               {/* Client ID */}
                  <div className="row mb-6">
                    <label className="col-lg-4 col-form-label fw-bold fs-6 required">
                      <span className="">Client Name</span>
                    </label>
                    <div className="col-lg-8 fv-row">
                    <select
                    id="clientId"
                    className="form-select form-select-solid form-select-lg fw-bold"
                    
                    
                    onChange={async (e) => {
                      await handleClientChange(parseInt(e.target.value));
                      formik.setFieldValue("clientId", updatedProposal.clientId);
                    }}
                    
                  > 
                    <option value="">Select Client</option>
                    {allUserInfo.map((data: any, i: number) => (
                      <option key={i} value={data.id}>
                        {data.client_name}
                      </option>
                    ))}
                  </select>
                    </div>
                  </div>   

                {/* Resource Name */}
                <div className="row mb-6">
                  <label className="col-lg-4 col-form-label fw-bold fs-6">
                    <span className="required">Resource Name</span>
                  </label>
                  <div className="col-lg-8 fv-row">
                    <input
                    type="text"
                        className="form-control form-control-lg form-control-solid"
                        placeholder="Enter Resource Name"
                        onChange={(value) => {
                          updateData({ resourceName: value.target.value });
                          formik.setFieldValue("resourceName",value.target.value)
                        }}
                    />
                  </div>
                </div>

                {/* Designation */}
                <div className="row mb-6">
                  <label className="col-lg-4 col-form-label fw-bold fs-6">
                    <span className="required">Designation</span>
                  </label>
                  <div className="col-lg-8 fv-row">
                    <input
                      type="text"
                        className="form-control form-control-lg form-control-solid"
                        placeholder="Enter Designation"
                        onChange={(value) => {
                          updateData({ designation: value.target.value });
                          formik.setFieldValue("designation",value.target.value)
                        }}
                    />
                  </div>
                </div>

                {/* Billing Annually */}
                <div className="row mb-6">
                  <label className="col-lg-4 col-form-label fw-bold fs-6">
                    <span className="required">Billing Annually</span>
                  </label>
                  <div className="col-lg-8 fv-row">
                    <input
                       type="number"
                        className="form-control form-control-lg form-control-solid"
                        placeholder="Enter Annual Billing"
                
                        onChange={(value) => {
                          updateData({ billingAnnually: parseInt(value.target.value) });
                          formik.setFieldValue("billingAnnually",value.target.value)
                        }}
                    />
                  </div>
                </div>

                {/* Billing Months */}
                 <div className="row mb-6">
                    <label className="col-lg-4 col-form-label fw-bold fs-6">
                      <span className="required">Billing Months </span>
                    </label>
                    <div className="col-lg-8 fv-row">
                    <select
                        className='form-select form-select-lg form-select-solid'
                        data-control='select2'
                        data-placeholder='Select Billing Months'
      
                        onChange={(e) => updateData({billingMonths: (e.target.value)})}
                      >
                        <option hidden>Select billingMonths</option>
                        <option value='6 Months'>6 Months</option>
                        <option value='11 Months'>11 Months</option>
                        <option value='12 Months'>12 Months</option>
                      </select>
            
                      {formik.touched.billingMonths && formik.errors.billingMonths && (
                        <div className="fv-plugins-message-container">
                          <div className="fv-help-block">
                            {formik.errors.billingMonths}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                {/* Version */}
                <div className="row mb-6">
                  <label className="col-lg-4 col-form-label fw-bold fs-6">
                    <span className="required">Version</span>
                  </label>
                  <div className="col-lg-8 fv-row">
                    <input
                        type="number"
                        className="form-control form-control-lg form-control-solid"
                        placeholder="Enter Version"
                        onChange={(value) => {
                          updateData({ version: parseFloat(value.target.value) });
                          formik.setFieldValue("version",value.target.value)
                        }}
                    />
                  </div>
                </div>

                {/* URL */}
                <div className="row mb-6">
                    <label className="col-lg-4 col-form-label  fw-bold fs-6">
                      File Upload
                    </label>
                      <div className="col-lg-8 fv-row">
                        <div className="input-group"> 
                        <input
                        type="file"
                        className="form-control form-control-lg form-control-solid"
                        placeholder="Upload TimeSheet"
                        onChange={handleFileChange}
                        />
                    <span className="input-group-badge badge badge-success cursor-pointer"
                      onClick={handleUpload}>
                        Click To Upload
                     </span></div>
                    </div>
                </div>

                {/* Submit Button */}
                <div className="card-footer d-flex justify-content-end py-6 px-9">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {!loading && "Save Proposal"}
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
    </div>
  );
};

export { CreateProposal };
