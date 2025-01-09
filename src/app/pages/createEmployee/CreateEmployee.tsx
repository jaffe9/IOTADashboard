import { useState, FC } from "react";
import {
  IProfileDetails,
  profileDetailsInitValues as initialValues,
} from "../../modules/accounts/components/settings/SettingsModel";
import * as Yup from "yup";
import { useFormik } from "formik";
import Flatpickr from "react-flatpickr";
import { apiHelper, createTempEmployee } from "../../../apiFactory/apiHelper";
import {
  User,
  clients,
  temEmp,
} from "../../modules/apps/user-management/users-list/core/_models";
import ChipsDemo from "./multiSelectDropDown";



// var allUserInfo: any = await apiHelper.getAllEmployees().then(async (data) => {
//   return data.data;
// });
var allUserInfo: any = await Promise.all(
  [ apiHelper.getAllEmployees(), apiHelper.getClientDetails(), apiHelper.getAccountManager() ]
).then(([employee,clients ,manager]) => {
  return { employee:employee.data, clients:clients.data , manager:manager.data}
})
let updatedUserInfo: IProfileDetails = initialValues;


const CreateEmployee: FC = () => {
  const [data, setData] = useState<IProfileDetails>(updatedUserInfo);
  const updateData = (fieldsToUpdate: Partial<IProfileDetails>): void => {
    const updatedData = Object.assign(updatedUserInfo, fieldsToUpdate);
    setData(updatedData);
  };


  const handleAccountManagerChange = async (accountManagerid : number) => {
    updateData({
      associated_account_manager: accountManagerid,
    })    
  }
  const handleChange = async (client_name : string) => {
    var hasMatch = allUserInfo.clients.find(function (value : clients){
      return value.client_name == client_name;
    });
    updateData({
      client_id : hasMatch.id,
      companyName : hasMatch.client_name,
    })
  }
  const handleUserChange = async (userName: string) => {
    var hasMatch = allUserInfo.employee.find(function (value: User) {
      return value.firstName == userName;
    });
    updateData({
      uName : userName,
      fName: hasMatch.firstName,
    });
  };

  const [loading, setLoading] = useState(false);
  const formik = useFormik<IProfileDetails>({
    initialValues,
    onSubmit:async () => {
      setLoading(true);
      setTimeout(async () => {
        const updatedData = Object.assign(data, updatedUserInfo);
        setData(updatedData);
        if(data.client_id < 1 || data.associated_account_manager == null || data.uName == null || data.fullName == null  )
        {
          alert("Please select all fields")
          setLoading(false)
          return
        }
        const tempEmp : temEmp = {
          username : data.uName,
          password : data.password,
          email : data.email,
          firstName : data.fName,
          lastName : data.lName,
          fullName : data.fullName,
          occupation : data.occupation,
          companyName : data.companyName,
          phone : data.phone,
          language: data.language,
          timeZone : data.timeZone,
          address : data.address,
          clientId : data.client_id,
          associated_account_manager : data.associated_account_manager,
        };
        const apiResponse = await createTempEmployee(tempEmp)
        if (apiResponse.status === 201)
          {
            alert("Employee created  Successful");
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
            <div
              className="card-header border-0 cursor-pointer"
              role="button"
              data-bs-toggle="collapse"
              data-bs-target="#kt_account_profile_details"
              aria-expanded="true"
              aria-controls="kt_account_profile_details"
            >
              <div className="card-title m-0">
                <h3 className="fw-bolder m-0">Create Employee</h3>
              </div>
            </div>
            <div className="card-body border-top p-9">
              <div className="row mb-6">
                <label className="col-lg-4 col-form-label fw-bold fs-6">
                  <span className="required">Employee Name</span>
                </label>
                <div className="col-lg-8 fv-row">
                <input
                        type="text"
                        className="form-control form-control-lg form-control-solid"
                        placeholder="Enter User Name"
                
                        onChange={(value) => {
                          updateData({ uName: value.target.value });
                          formik.setFieldValue("username",value.target.value)
                        }}
                      />
                  {/* {formik.touched.sEmployee && formik.errors.sEmployee && (
                    <div className="fv-plugins-message-container">
                      <div className="fv-help-block">{formik.errors.sEmployee}</div>
                    </div>
                  )} */}
                </div>
              </div>
            </div>
            <div id="kt_account_profile_details" className="collapse show">
              <form onSubmit={formik.handleSubmit}  noValidate className="form">
                <div className="card-body border-top p-9">
                  <div className="row mb-6">
                    <label className="col-lg-4 col-form-label required fw-bold fs-6">
                      Enter First Name
                    </label>
                    <div className="col-lg-8 fv-row">
                    <input
                        type="text"
                        className="form-control form-control-lg form-control-solid"
                        placeholder="Enter First Name"
                       // {...formik.getFieldProps("expenseTypeDesc")}
                        onChange={(value) => {
                          updateData({ fName: value.target.value });
                          formik.setFieldValue("firstName",value.target.value)
                        }}
                      />
                      {formik.touched.expenseType && formik.errors.expenseType && (
                        <div className="fv-plugins-message-container">
                          <div className="fv-help-block">
                            {formik.errors.expenseType}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="row mb-6">
                    <label className="col-lg-4 col-form-label required fw-bold fs-6">
                      Enter Last Name
                    </label>
                    <div className="col-lg-8 fv-row">
                    <input
                        type="text"
                        className="form-control form-control-lg form-control-solid"
                        placeholder="Enter Last Name"
                        onChange={(value) => {
                          updateData({ lName: value.target.value });
                          formik.setFieldValue("lastName",value.target.value)
                        }}
                      />
                      {formik.touched.lName && formik.errors.lName && (
                        <div className="fv-plugins-message-container">
                          <div className="fv-help-block">
                            {formik.errors.lName}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="row mb-6">
                    <label className="col-lg-4 col-form-label required fw-bold fs-6">
                      Enter Full Name
                    </label>
                    <div className="col-lg-8 fv-row">
                    <input
                        type="text"
                        className="form-control form-control-lg form-control-solid"
                        placeholder="Enter Full Name"
                       // {...formik.getFieldProps("expenseTypeDesc")}
                        onChange={(value) => {
                          updateData({ fullName: value.target.value });
                          formik.setFieldValue("fullName",value.target.value)
                        }}
                      />
                      {formik.touched.fullName && formik.errors.fullName && (
                        <div className="fv-plugins-message-container">
                          <div className="fv-help-block">
                            {formik.errors.fullName}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                 
                  <div className="row mb-6">
                    <label className="col-lg-4 col-form-label required fw-bold fs-6">
                      Enter Email
                    </label>
                    <div className="col-lg-8 fv-row">
                    <input
                        type="text"
                        className="form-control form-control-lg form-control-solid"
                        placeholder="Enter Eamil"
                    
                        onChange={(value) => {
                          updateData({ email: value.target.value });
                          formik.setFieldValue("email",value.target.value)
                        }}
                      />
                      {formik.touched.email && formik.errors.email && (
                        <div className="fv-plugins-message-container">
                          <div className="fv-help-block">
                            {formik.errors.email}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="row mb-6">
                    <label className="col-lg-4 col-form-label required fw-bold fs-6">
                      Enter Occupation
                    </label>
                    <div className="col-lg-8 fv-row">
                    <input
                        type="text"
                        className="form-control form-control-lg form-control-solid"
                        placeholder="Enter Position of Employee"
                       // {...formik.getFieldProps("expenseTypeDesc")}
                        onChange={(value) => {
                          updateData({ occupation: value.target.value });
                          formik.setFieldValue("occupation",value.target.value)
                        }}
                      />
                      {formik.touched.occupation && formik.errors.occupation && (
                        <div className="fv-plugins-message-container">
                          <div className="fv-help-block">
                            {formik.errors.occupation}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="row mb-6">
                    <label className="col-lg-4 col-form-label required fw-bold fs-6">
                      Client Name
                    </label>
                    <div className="col-lg-8 fv-row">
                      <select
                      id="companyName"
                      className="form-select form-select-solid form-select-lg fw-bold"
                      {...formik.getFieldProps("client_name")}
                      
                      onChange={async (e) => {
                        await handleChange(e.target.value);
                        formik.setFieldValue("companyName", updatedUserInfo.companyName);
                        formik.setFieldValue("client_id",updatedUserInfo.client_id)
                      }}
                    value={initialValues.companyName}
                    > 
                      <option value="">Select Client </option>
                      {allUserInfo.clients.map((data: any, i: number) => (
                        <option key={i} value={data.client_name}>
                          {data.client_name}
                        </option>
                      ))}
                    </select>
                    </div>
                  </div>

                  <div className="row mb-6">
                    <label className="col-lg-4 col-form-label  fw-bold fs-6"> 
                      Client Id
                    </label>
                    <div className="col-lg-8 fv-row">
                      <input
                        readOnly
                        type="text"
                        className="form-control form-control-lg form-control-solid"
                        placeholder="Client Id"
                        {...formik.getFieldProps("client_id")}
                        onChange={async (e) => {
                          await handleChange(e.target.value);
                          
                        }}
                      />
                      {formik.touched.client_id && formik.errors.client_id && (
                        <div className="fv-plugins-message-container">
                          <div className="fv-help-block">
                            
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="row mb-6">
                    <label className="col-lg-4 col-form-label fw-bold fs-6">
                      <span className="required">Phone </span>
                    </label>
                    <div className="col-lg-8 fv-row">
                    <input
                        type="text"
                        className="form-control form-control-lg form-control-solid"
                        placeholder="Enter Phone number"
                       // {...formik.getFieldProps("expenseTypeDesc")}
                        onChange={(value) => {
                          updateData({ phone: value.target.value });
                          formik.setFieldValue("phone",value.target.value)
                        }}
                      />
                      {formik.touched.phone && formik.errors.phone && (
                        <div className="fv-plugins-message-container">
                          <div className="fv-help-block">
                            {formik.errors.phone}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                   
                  <div className="row mb-6">
                    <label className="col-lg-4 col-form-label fw-bold fs-6">
                      <span className="required">Language </span>
                    </label>
                    <div className="col-lg-8 fv-row">
                    <ChipsDemo/>
            
                      {formik.touched.language && formik.errors.language && (
                        <div className="fv-plugins-message-container">
                          <div className="fv-help-block">
                            {formik.errors.language}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="row mb-6">
                    <label className="col-lg-4 col-form-label fw-bold fs-6">
                      <span className="required">TimeZone </span>
                    </label>
                    <div className="col-lg-8 fv-row">
                    <select
                        className='form-select form-select-lg form-select-solid'
                        data-control='select2'
                        data-placeholder='Select TiemZone...'
      
                        onChange={(e) => updateData({timeZone: e.target.value})}
                      >
                         <option hidden>Select TimeZone</option>
                          <option value="Etc/GMT+12">(GMT-12:00) International Date Line West</option>
                          <option value="Pacific/Midway">(GMT-11:00) Midway Island, Samoa</option>
                          <option value="Pacific/Honolulu">(GMT-10:00) Hawaii</option>
                          <option value="US/Alaska">(GMT-09:00) Alaska</option>
                          <option value="America/Los_Angeles">(GMT-08:00) Pacific Time (US & Canada)</option>
                          <option value="America/Tijuana">(GMT-08:00) Tijuana, Baja California</option>
                          <option value="US/Arizona">(GMT-07:00) Arizona</option>
                          <option value="America/Chihuahua">(GMT-07:00) Chihuahua, La Paz, Mazatlan</option>
                          <option value="US/Mountain">(GMT-07:00) Mountain Time (US & Canada)</option>
                          <option value="America/Managua">(GMT-06:00) Central America</option>
                          <option value="US/Central">(GMT-06:00) Central Time (US & Canada)</option>
                          <option value="America/Mexico_City">(GMT-06:00) Guadalajara, Mexico City, Monterrey</option>
                          <option value="Canada/Saskatchewan">(GMT-06:00) Saskatchewan</option>
                          <option value="America/Bogota">(GMT-05:00) Bogota, Lima, Quito, Rio Branco</option>
                          <option value="US/Eastern">(GMT-05:00) Eastern Time (US & Canada)</option>
                          <option value="US/East-Indiana">(GMT-05:00) Indiana (East)</option>
                          <option value="Canada/Atlantic">(GMT-04:00) Atlantic Time (Canada)</option>
                          <option value="America/Caracas">(GMT-04:00) Caracas, La Paz</option>
                          <option value="America/Manaus">(GMT-04:00) Manaus</option>
                          <option value="America/Santiago">(GMT-04:00) Santiago</option>
                          <option value="Canada/Newfoundland">(GMT-03:30) Newfoundland</option>
                          <option value="America/Sao_Paulo">(GMT-03:00) Brasilia</option>
                          <option value="America/Argentina/Buenos_Aires">(GMT-03:00) Buenos Aires, Georgetown</option>
                          <option value="America/Godthab">(GMT-03:00) Greenland</option>
                          <option value="America/Montevideo">(GMT-03:00) Montevideo</option>
                          <option value="America/Noronha">(GMT-02:00) Mid-Atlantic</option>
                          <option value="Atlantic/Cape_Verde">(GMT-01:00) Cape Verde Is.</option>
                          <option value="Atlantic/Azores">(GMT-01:00) Azores</option>
                          <option value="Africa/Casablanca">(GMT+00:00) Casablanca, Monrovia, Reykjavik</option>
                          <option value="Etc/Greenwich">(GMT+00:00) Greenwich Mean Time : Dublin, Edinburgh, Lisbon, London</option>
                          <option value="Europe/Amsterdam">(GMT+01:00) Amsterdam, Berlin, Bern, Rome, Stockholm, Vienna</option>
                          <option value="Europe/Belgrade">(GMT+01:00) Belgrade, Bratislava, Budapest, Ljubljana, Prague</option>
                          <option value="Europe/Brussels">(GMT+01:00) Brussels, Copenhagen, Madrid, Paris</option>
                          <option value="Europe/Sarajevo">(GMT+01:00) Sarajevo, Skopje, Warsaw, Zagreb</option>
                          <option value="Africa/Lagos">(GMT+01:00) West Central Africa</option>
                          <option value="Asia/Amman">(GMT+02:00) Amman</option>
                          <option value="Europe/Athens">(GMT+02:00) Athens, Bucharest, Istanbul</option>
                          <option value="Asia/Beirut">(GMT+02:00) Beirut</option>
                          <option value="Africa/Cairo">(GMT+02:00) Cairo</option>
                          <option value="Africa/Harare">(GMT+02:00) Harare, Pretoria</option>
                          <option value="Europe/Helsinki">(GMT+02:00) Helsinki, Kyiv, Riga, Sofia, Tallinn, Vilnius</option>
                          <option value="Asia/Jerusalem">(GMT+02:00) Jerusalem</option>
                          <option value="Europe/Minsk">(GMT+02:00) Minsk</option>
                          <option value="Africa/Windhoek">(GMT+02:00) Windhoek</option>
                          <option value="Asia/Kuwait/Riyadh">(GMT+03:00) Kuwait, Riyadh, Baghdad</option>
                          <option value="Europe/Moscow">(GMT+03:00) Moscow, St. Petersburg, Volgograd</option>
                          <option value="Africa/Nairobi">(GMT+03:00) Nairobi</option>
                          <option value="Asia/Tbilisi">(GMT+03:00) Tbilisi</option>
                          <option value="Asia/Tehran">(GMT+03:30) Tehran</option>
                          <option value="Asia/Muscat">(GMT+04:00) Abu Dhabi, Muscat</option>
                          <option value="Asia/Baku">(GMT+04:00) Baku</option>
                          <option value="Asia/Yerevan">(GMT+04:00) Yerevan</option>
                          <option value="Asia/Kabul">(GMT+04:30) Kabul</option>
                          <option value="Asia/Yekaterinburg">(GMT+05:00) Yekaterinburg</option>
                          <option value="Asia/Karachi">(GMT+05:00) Islamabad, Karachi, Tashkent</option>
                          <option value="Asia/Calcutta">(GMT+05:30) Chennai, Kolkata, Mumbai, New Delhi</option>
                          <option value="Asia/Calcutta">(GMT+05:30) Sri Jayawardenapura</option>
                          <option value="Asia/Katmandu">(GMT+05:45) Kathmandu</option>
                          <option value="Asia/Almaty">(GMT+06:00) Almaty, Novosibirsk</option>
                          <option value="Asia/Dhaka">(GMT+06:00) Astana, Dhaka</option>
                          <option value="Asia/Rangoon">(GMT+06:30) Yangon (Rangoon)</option>
                          <option value="Asia/Bangkok">(GMT+07:00) Bangkok, Hanoi, Jakarta</option>
                          <option value="Asia/Krasnoyarsk">(GMT+07:00) Krasnoyarsk</option>
                          <option value="Asia/Hong_Kong">(GMT+08:00) Beijing, Chongqing, Hong Kong, Urumqi</option>
                          <option value="Asia/Kuala_Lumpur">(GMT+08:00) Kuala Lumpur, Singapore</option>
                          <option value="Asia/Irkutsk">(GMT+08:00) Irkutsk, Ulaan Bataar</option>
                          <option value="Australia/Perth">(GMT+08:00) Perth</option>
                          <option value="Asia/Taipei">(GMT+08:00) Taipei</option>
                          <option value="Asia/Tokyo">(GMT+09:00) Osaka, Sapporo, Tokyo</option>
                          <option value="Asia/Seoul">(GMT+09:00) Seoul</option>
                          <option value="Asia/Yakutsk">(GMT+09:00) Yakutsk</option>
                          <option value="Australia/Adelaide">(GMT+09:30) Adelaide</option>
                          <option value="Australia/Darwin">(GMT+09:30) Darwin</option>
                          <option value="Australia/Brisbane">(GMT+10:00) Brisbane</option>
                          <option value="Australia/Canberra">(GMT+10:00) Canberra, Melbourne, Sydney</option>
                          <option value="Australia/Hobart">(GMT+10:00) Hobart</option>
                          <option value="Pacific/Guam">(GMT+10:00) Guam, Port Moresby</option>
                          <option value="Asia/Vladivostok">(GMT+10:00) Vladivostok</option>
                          <option value="Asia/Magadan">(GMT+11:00) Magadan, Solomon Is., New Caledonia</option>
                          <option value="Pacific/Auckland">(GMT+12:00) Auckland, Wellington</option>
                          <option value="Pacific/Fiji">(GMT+12:00) Fiji, Kamchatka, Marshall Is.</option>
                          <option value="Pacific/Tongatapu">(GMT+13:00) Nuku'alofa</option>
                      </select>
            
                      {formik.touched.timeZone&& formik.errors.timeZone&& (
                        <div className="fv-plugins-message-container">
                          <div className="fv-help-block">
                            {formik.errors.timeZone}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="row mb-6">
                    <label className="col-lg-4 col-form-label fw-bold fs-6">
                      <span className="required">Address </span>
                    </label>
                    <div className="col-lg-8 fv-row">
                    <input
                        type="text"
                        className="form-control form-control-lg form-control-solid"
                        placeholder="Enter Address"
                       // {...formik.getFieldProps("expenseTypeDesc")}
                        onChange={(value) => {
                          updateData({ address: value.target.value });
                          formik.setFieldValue("address",value.target.value)
                        }}
                      />
                      {formik.touched.address && formik.errors.address && (
                        <div className="fv-plugins-message-container">
                          <div className="fv-help-block">
                            {formik.errors.address}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="row mb-6">
                    <label className="col-lg-4 col-form-label fw-bold fs-6 required">
                      <span className="">Created By</span>
                    </label>
                    <div className="col-lg-8 fv-row">
                    <select
                    id="accountManger"
                    className="form-select form-select-solid form-select-lg fw-bold"
                    {...formik.getFieldProps("associated_account_manager")}
                    
                    onChange={async (e) => {
                      await handleAccountManagerChange(parseInt(e.target.value));
                      formik.setFieldValue("associated_account_maager", updatedUserInfo.associated_account_manager);
                    }}
                    
                  > 
                    <option value="">Select Account Manager</option>
                    {allUserInfo.manager.map((data: any, i: number) => (
                      <option key={i} value={data.id}>
                        {data.accountManagerName}
                      </option>
                    ))}
                  </select>
                      {formik.touched.associated_account_manager&& formik.errors.associated_account_manager&& (
                        <div className="fv-plugins-message-container">
                          <div className="fv-help-block">
                            {formik.errors.associated_account_manager}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>                  
                </div>
                
                <div className="card-footer d-flex justify-content-end py-6 px-9">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                    onClick={this}
                    
                  >
                    {!loading && "Save Changes"}
                    {loading && (
                      <span
                        className="indicator-progress"
                        style={{ display: "block" }}
                      >
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

export { CreateEmployee };