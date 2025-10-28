import axios, { isAxiosError } from "axios";
import { Proposal, Payslips } from "../app/modules/apps/user-management/users-list/core/_models";
import { INationalIdInfo } from "../app/pages/NationalIdPage/createNationalId";


axios.defaults.headers.common['Authorization'] = `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpocGxrdGFvdnB5ZW5teXBranFsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY5MjUxOTYzMywiZXhwIjoyMDA4MDk1NjMzfQ.i-QsgcR7aZTxpubO0dHGPs-li50B7GrVQKsuW866YLA`;
axios.defaults.headers.common['apikey'] = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpocGxrdGFvdnB5ZW5teXBranFsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY5MjUxOTYzMywiZXhwIjoyMDA4MDk1NjMzfQ.i-QsgcR7aZTxpubO0dHGPs-li50B7GrVQKsuW866YLA`;

//const API_URL = import.meta.env.VITE_APP_THEME_API_URL;
const API_URL = `https://zhplktaovpyenmypkjql.supabase.co/rest/v1`;
const STORAGE_URL = 'https://zhplktaovpyenmypkjql.supabase.co/storage/v1'
const GET_USERS_URL = `${API_URL}/user`;
const GET_OCCUPATION_URL = `${API_URL}/employeeBand`;
const GET_TEMP_USERS_URL = `${API_URL}/tempUser`;
const GET_EXPENSE = `${API_URL}/expensesType`;
const GET_ACCOUNT_MANAGER = `${API_URL}/accountManager`;
const GET_USER_SALARY_URL = `${API_URL}/salary`;
const GET_CLIENT_DETAILS_URL = `${API_URL}/clients`;
const GET_USER_SALARY_DETAIL_URL = `${API_URL}/salaryDetails`;
const GET_USER_CONTRACT_URL = `${API_URL}/contract`;
const GET_EMPLOYEEONBOARDING_URL = `${API_URL}/employeeOnboarding`;
const GET_EMPLOYEEINVOICE_URL = `${API_URL}/invoice`;
const GET_TIMESHEET_URL = `${API_URL}/employeeTimesheet`;
const CREATE_SHORT_URL = 'https://faas-blr1-8177d592.doserverless.co/api/v1/web/fn-d76aa7c6-640f-43cf-8b26-09613462a4ac/axios/createShortUrl'
const admin = "db273513-e759-4f6a-99b4-8371423a45b8";

// date format for Form //
const today = new Date();
const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0); // Last day of previous month



const update_date = `${lastMonth.toLocaleString("en-IN",{month : "short"})}_${lastMonth.getFullYear()}`

const iPayPrd = `${lastMonth.toLocaleString("en-IN",{month : "long"})}_${lastMonth.getFullYear()}`
// console.log("This is date check :", iPayPrd);

const getYear = today.toLocaleString("en-IN",{
     year : "numeric"
}).replace(/\//g,"")
const setYear = `Year_${getYear}`


// User Count
const axiosInstance = axios.create({
  baseURL: `${API_URL}`,
  headers: {
    'apikey': `${axios.defaults.headers.common['apikey']}`,
    'Authorization': `${axios.defaults.headers.common['Authorization']}`
  }
});

const axiosEncoreInstance = axios.create({
  baseURL: 'https://staging-iwtapiserver-6x92.encr.app',
  headers: {
    'apikey': `${axios.defaults.headers.common['apikey']}`,
    'Authorization': `${axios.defaults.headers.common['Authorization']}`
  }

});

export const updateProposalData = async (p: Proposal): Promise<{status:number; message:string}> => {
  let data = JSON.stringify({
    clientId: p.clientId,
    resourceName: p.resourceName,
    billingAnnually: p.billingAnnually,
    billingMonths: p.billingMonths,
    version: p.version,
    status: p.status,
    url: p.url,
    designation: p.designation
  });

  console.log("APIData:", data);

  let config = {
    method: 'PATCH',
    maxBodyLength: Infinity,
    url: `${API_URL}/proposals?id=eq.${p.id}`,
    headers: {
      'apikey': `${axios.defaults.headers.common['apikey']}`,
      'Authorization': `${axios.defaults.headers.common['Authorization']}`,
      'Content-Type': 'application/json'
    },
    data: data
  };

  try {
    const response = await axios.request(config);
    
    if (response.status === 200 || response.status === 204) {
      return { status: response.status, message: "Success" };
    } else {
      return { status: response.status, message: "Failed" };
    }
  } catch (error) {
    if (axios.isAxiosError(error)){
      console.error("error:", error.response?.data || error.message);
    } else {
      console.error("Unexpected error:", error);
    }

    return { status: 500, message: "Error updating proposal" };
  }
};


export const createPayslip = async (p: Payslips): Promise<{status:number; message:string}> => {
  const data = JSON.stringify([
    {
        associatedUserId : p.associatedUserId,
        paySlipLink : p.paySlipLink ,
        monthYear : p.monthYear,
        fullName : p.fullName,
    }
  ]);
  console.log("APIData:" + data);
  const config = {
    method: 'post',
    url: `${API_URL}/payslipTable`,
    headers: {
      'apikey': `${axios.defaults.headers.common['apikey']}`, // Use environment variable
      'Authorization' :`${axios.defaults.headers.common['Authorization']}`, // Use environment variable
      'Content-Type': 'application/json'
    },
    data: data
  };

  try {
    const response = await axios.request(config);
    
    if (response.status === 201) {
      return { status: response.status, message: "Success" }; // Return an object
    } else {
     return { status: response.status, message: "Failed" }; // Return an object
    }
  } catch (error) {
    console.error("Error creating payslip:", error);
    return { status: 500, message: "Error occurred while creating payslip" }; // Return an object
  }
};

export const uploadPayslipsToSupabase= async (file: File): Promise<string | null> => {
  const filePath = `iwt_payslips/${setYear}/${update_date}/${file.name}`;

  const uploadConfig = {
    method: 'POST',
    maxBodyLength: Infinity,
    url: `${STORAGE_URL}/object/${filePath}`,
    headers: {
      'Authorization': `${axios.defaults.headers.common['Authorization']}`,
      'Content-Type': file.type,
    },
    data: file,
  };

  try {
    // Step 1: Upload to Supabase
    const uploadResponse = await axios(uploadConfig);
    if (uploadResponse.status !== 200) throw new Error("Upload failed");

    // Step 2: Generate Signed URL (1 year)
    const signedUrlResponse = await axios.post(
      `${STORAGE_URL}/object/sign/${filePath}`,
      { expiresIn: 60 * 60 * 24 * 365 * 20 },
      {
        headers: {
          'Authorization': `${axios.defaults.headers.common['Authorization']}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (
      signedUrlResponse.status !== 200 ||
      !signedUrlResponse.data?.signedURL
    ) {
      throw new Error("Failed to generate signed URL");
    }

    const fullSignedUrl = `${STORAGE_URL}${signedUrlResponse.data.signedURL}`;

    // // Step 3: Shorten the Signed URL
    // const shortenResponse = await axios.get(
    //   `${CREATE_SHORT_URL}`,
    //   {
    //     params: { url: fullSignedUrl },
    //   }
    // );

    // if (
    //   shortenResponse.status === 200 &&
    //   shortenResponse.data?.secureShortURL
    // ) {
    //   return shortenResponse.data.secureShortURL; //  This will go into invoice_url
    // } else {
    //   throw new Error("Short URL generation failed");
    // }
    return fullSignedUrl
  } catch (error) {
    console.error('Error uploading, signing, or shortening invoice URL:', error);
    return null;
  }
}; 

// get the salaries for payslips generation 
export const getSalForPay = async (employeeId : string) => {
  try{
    const response = await axiosInstance.get(
      `user?id=eq.${employeeId}&select=*,salary(user_id,*)`
    );
    console.log("Response for getSalaray for payslip  :", response.data)
    return response.data;
  }catch(error){
    if(axios.isAxiosError(error)){
       console.log("Error in getting getting sal for payslips  :" , error.response?.data || error.message )
    }else{
      console.log("Error in getiing salaries for payslips  : ", error)
    }
  }
};

export const fetchPayslip = async (month : string, year : string) => {
   try{
     const response = await axiosInstance.get(`payslipTable?select=associatedUserId(fullName,email),paySlipLink&monthYear=eq.${month} ${year}`)
     return response.data
   }catch(error){
     if(isAxiosError(error)){
      console.error("Error in fetching PaySlips of Employee :", error.response?.data)
     }else{
      console.error("Some internal Server Error :", error)
     }
   }
}


export const sendPayslipEmail = async (email: string, name: string, link: string, month: string, year: string) => {
  try {
    const response = await axiosEncoreInstance.post(
      "/sendPayslipEmail",
      { email, name, link, month, year },
      { headers: { "Content-Type": "application/json" } }
    );
    console.log(`Email sent to ${email}:`, response.data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error in sending payslip email:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
        url: error.config?.url,
        payload: { email, name, link, month, year }
      });
    } else {
      console.error("Error in sending payslip email:", error);
    }
    throw error;
  }
};

// Check for existing payslip before uploading 
export const checkPayslipExist = async (id: number, monthYear: string) => {
  try {
    const response = await axiosInstance.get(
      `payslipTable?select=associatedUserId,monthYear&associatedUserId=eq.${id}&monthYear=eq.${monthYear}`
    );
   
    console.log("This is response from checkPayslip : ", response.data, response.config.url)
    // Return true if array has items, false if empty
    return response.data && response.data.length > 0;
    
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error from checkPayslips:", error.response?.data);
    } else {
      console.error("Internal server error while checking existing payslip!");
    }
    // Return false on error to allow submission (or throw error to prevent it)
    return false;
  }
};

export const getMissingNationalId = async() =>{
   try{
     const response = await axiosEncoreInstance.get("/getUserForNId")
     console.log("Missing National Id are : ", response.data)
     return response.data
   }catch(error){
    if(isAxiosError(error)){
      console.error("Error in fetching National Id :", error.response?.data)
    }else{
      console.error("Internal server error in line 292 of getMissingNationalId")
    }
   }
}

export const createNationalId = async (i:INationalIdInfo): Promise<{status:number; message:string}> => {
  console.log("Sending National Id response to Encore API:", i);

  try {
    const response = await axiosEncoreInstance.post('/postNationalId', i, {
      headers: {
        'Content-Type': 'application/json',
        // If your Encore API requires auth token, add here:
         'Authorization': 'slkjdfoihgiojooe'
      }
    });

    if (response.status === 201 || 204) {
      console.log("Encore API Response:", response.data);
      return { status: response.data.status, message: response.data.message };
    } else {
      console.error("Encore API failed:", response.statusText);
      return { status: response.status, message: "Failed" };
    }
  } catch (error) {
    if (axios.isAxiosError(error)){
      console.error("Encore API Error:", error.response?.data || error.message);
    } else {
      console.error("Unexpected error:", error);
    }

    return { status: 500, message: "Error Submitting national id via Encore API" };
  }
};

// -------------------------- Check National Id for the user --------------------------------
export const checkNationalIdExist = async (id: number) => {
  try {
    const response = await axiosInstance.get(
      `nationalIdInfo?select=*&associated_user_id=eq.${id}`
    );
   
    console.log("This is response from CheckNational id : ", response.data, response.config.url);
    
    // Return true if array has items, false if empty
    return response.data && response.data.length > 0;
    
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error from checkNationalIdExist:", error.response?.data);
    } else {
      console.error("Internal server error while checking existing national ID!");
    }
    return false;
  }
};
