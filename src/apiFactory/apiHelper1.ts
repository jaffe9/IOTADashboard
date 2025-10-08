import axios, { isAxiosError } from "axios";
import { Proposal } from "../app/modules/apps/user-management/users-list/core/_models";

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