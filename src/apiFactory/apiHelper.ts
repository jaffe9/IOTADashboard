import axios from "axios";
import { resourceLimits } from "worker_threads";
import { ClaimRequest, ContractRequest, EmployeeOnboardingResponse, InvoiceRequest, Salary, UsersQueryResponse } from "../app/modules/apps/user-management/users-list/core/_models.ts";
import { ListOfTimesheet } from "../app/modules/apps/user-management/users-list/core/_models.ts";
import { TimesheetRequest } from "../app/modules/apps/user-management/users-list/core/_models.ts";

import { create } from "domain";
import { file } from "@form-validation/bundle/popular";
import { url } from "inspector";

class getUserDataParams {
  baseUrl: string | undefined
  headers: any
  method: string | undefined
  responseType: string | undefined
}
axios.defaults.headers.common['Authorization'] = `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpocGxrdGFvdnB5ZW5teXBranFsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY5MjUxOTYzMywiZXhwIjoyMDA4MDk1NjMzfQ.i-QsgcR7aZTxpubO0dHGPs-li50B7GrVQKsuW866YLA`;
axios.defaults.headers.common['apikey'] = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpocGxrdGFvdnB5ZW5teXBranFsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY5MjUxOTYzMywiZXhwIjoyMDA4MDk1NjMzfQ.i-QsgcR7aZTxpubO0dHGPs-li50B7GrVQKsuW866YLA`;

//const API_URL = import.meta.env.VITE_APP_THEME_API_URL;
const API_URL = `https://zhplktaovpyenmypkjql.supabase.co/rest/v1`;
const GET_USERS_URL = `${API_URL}/user`;
const GET_EXPENSE = `${API_URL}/expensesType`;
const GET_ACCOUNT_MANAGER = `${API_URL}/accountManager`;
const GET_USER_SALARY_URL = `${API_URL}/salary`;
const GET_USER_SALARY_DETAIL_URL = `${API_URL}/salaryDetails`;
const GET_USER_CONTRACT_URL = `${API_URL}/contract`;
const GET_EMPLOYEEONBOARDING_URL = `${API_URL}/employeeOnboarding`;
const GET_EMPLOYEEINVOICE_URL = `${API_URL}/invoice`;
const GET_TIMESHEET_URL = `${API_URL}/employeeTimesheet`;
const DIGITAL_OCEAN_SECRET_KEY = `XbcuQv5Z/NiKom3Q4domcuCjr5yCRXYd/SvkQ/EDLqI`;
const DIGITAL_OCEAN_ACCESS_KEY = `DO00J84DXXRHLZHJBHJF`;
const DIGITAL_OCEAN_PERSONAL_ACCESS_TOKEN = `dop_v1_8812d0f4fbefad3d4a7e9317bc8be87ac1a14c22d20e8ad6b7876ea07b7cc80b`;
// User Count
const axiosInstance = axios.create({
  baseURL: 'https://zhplktaovpyenmypkjql.supabase.co/rest/v1/',
  headers: {
    'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpocGxrdGFvdnB5ZW5teXBranFsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY5MjUxOTYzMywiZXhwIjoyMDA4MDk1NjMzfQ.i-QsgcR7aZTxpubO0dHGPs-li50B7GrVQKsuW866YLA',
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpocGxrdGFvdnB5ZW5teXBranFsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY5MjUxOTYzMywiZXhwIjoyMDA4MDk1NjMzfQ.i-QsgcR7aZTxpubO0dHGPs-li50B7GrVQKsuW866YLA'
  }
});

export const getUserCount = async () => {
  try {
    const response = await axiosInstance.get('user?select=*&isClientFacing=eq.1', { timeout: 1500 });
    return response.data.length;
  } catch (error) {
    console.error('Error fetching data:', error);
    return null
  }
};

// Contract Data

export const getInvoiceTotalValue = async () => {
  try {
    const response = await axiosInstance.get('invoice?select=*');//changed 18 Nov
    return response;
  } catch (error) {
    console.error('Error fetching data:', error);
    return null
  }
};
//Fetching the Contract Expiries
export const getContractExpiries = async () => {
  try {
    const response = await axiosInstance.get('contract?select=*,associated_user_id(username,companyName)');
    return response.data;
    } catch (error) {
      console.error('Error fetching data:', error);
      return null
      }
}
// Fetching the data related to national_id
export const getNationalIdExp = async () => {
  try{
    const response = await axiosInstance.get('nationalIdInfo?select=*,associated_user_id(username,companyName)');
    return response.data;
  }catch (error){
    console.error('Error fetching national_id data:', error);
    return null
  }
}

// Fetching the data related to national_id
export const getLeavesLeft = async () => {
  try{
    const response = await axiosInstance.get("leaveEntitlment?select=*,user_id(username,companyName)&order=id");
    return response.data;
  }catch (error){
    console.error('Error fetching Leaves Left for employees:', error);
    return null
  }
}

// Opportunities Data
export const getAllOpportunities = async () => {
  try {
    const response = await axiosInstance.get('opportunities?select=*,clients(id,*),opportunityStatus(id,*)');
    return response;
  } catch (error) {
    console.error('Error fetching data:', error);
    return null
  }
};

// Salary Data
export const getAllSalaries = async () => {
  try {
    const response = await axiosInstance.get('salary?select=*, user(id,*)', { timeout: 1500 });
    return response;
  } catch (error) {
    console.error('Error fetching data:', error);
    return null
  }
};

//Billing Data
export const getAllBilling = async () => {
  try {
    const response = await axiosInstance.get('salary?contract=*, user(id,*), client(id,*)', { timeout: 1500 });
    return response;
  } catch (error) {
    console.error('Error fetching data:', error);
    return null
  }
};

export const getSalaryInfoByEmployee = async (employeeId: string) => {
  try {
    const { data } = await axiosInstance.get(`salary?user_id=eq.${employeeId}&select=id,pay_period,basic_allowance,hr_allowance,deductions_total,end_of_service_allowance,travel_other_allowance,earnings_total,lop_days,employee_request,salary_advance,lop_salary_total,total_net_salary,total_net_salary_words,salary_pay_mode,working_days,holidays`);
    return await data[0];
  }
  catch (error) {
    console.error("Error fetching data: ", error);
  }
};

export const getAllEmployees = async (): Promise<UsersQueryResponse> => {
  const d = await axios
    .get(`${GET_USERS_URL}?select=id,username,email,firstName,lastName,occupation,companyName,clientId,contract_id,associated_account_manager,phone,employeeJoiningDate,employeeId&isClientFacing=eq.1&order=id`);
  return d;
};

export const getExpenses = async (): Promise<UsersQueryResponse> => {
  const d = await axios
    .get(`${GET_EXPENSE}?select=*&order=id`);
  return d;
};

export const getAccountManager = async (): Promise<UsersQueryResponse> => {
  const d = await axios
   .get(`${GET_ACCOUNT_MANAGER}?select=*&order=id`)
  return d;
}

export const getPeerEmployees = async (clientId: string): Promise<UsersQueryResponse> => {
  const d = await axios
    .get(`${GET_USERS_URL}?select=id,username,email,firstName,lastName,occupation,companyName,phone,employeeJoiningDate,employeeId,contract_id,salary(user_id,*),contract(associated_user_id,*)&isClientFacing=eq.1&order=id&clientId=eq.${clientId}`);
  return d;
};

export const getEmployeeInfo = async (employeeId: string): Promise<UsersQueryResponse> => {
  const d = await axios
    .get(`${GET_USERS_URL}?id=eq.${employeeId}`);
  return d;
};

export const getEmployeeSalaryInfo = async (employeeId: string): Promise<any> => {
  const d = await axios
    .get(`${GET_USER_SALARY_URL}?id=eq.${employeeId}`);
  return d;
};

export const getEmployeeSalaryDetailInfo = async (employeeId: string): Promise<any> => {
  const d = await axios
    .get(`${GET_USER_SALARY_DETAIL_URL}?associated_user_id=eq.${employeeId}`);
  return d;
};

export const getEmployeeBillingInfo = async (associated_user_id: string): Promise<any> => {
  const d = await axios
    .get(`${GET_USER_CONTRACT_URL}?id=eq.${associated_user_id}`);
  return d;
};

export const getEmployeeInvoiceInfo = async (associated_user_id: string): Promise<any> => {
  const d = await axios
    .get(`${GET_EMPLOYEEINVOICE_URL}?associated_user_id=eq.${associated_user_id}`);
  return d;
};

export const getEmployeesForOnboarding = async (): Promise<EmployeeOnboardingResponse> => {
  let response: EmployeeOnboardingResponse = {}
  const d = await axios
    .get(`${GET_EMPLOYEEONBOARDING_URL}?select=*,resourceOnboardingStatus(id,*), resource_end_client(id,*)`);
  response = d;
  return response;
};


// Start of Invoice
export const createEmployeeInvoice = async (i: InvoiceRequest): Promise<{status:number; message:string}> => {
  let data = JSON.stringify([
    {
      contract_id: i.contract_id,
      client_id: i.client_id,
      associated_user_id:i.associated_user_id,
      internal_invoice_no: i.internal_invoice_no,
      external_invoice_no: i.external_invoice_no,
      invoice_date: i.invoice_date,
      invoice_value: i.invoice_value,
      invoice_paid_status: false,
      invoice_url: null,
      invoice_paid_date:null,
      invoice_paid_amount:null,
    }
  ]);
  console.log("APIData:" + data);
  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'https://zhplktaovpyenmypkjql.supabase.co/rest/v1/invoice',
    headers: {
      'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpocGxrdGFvdnB5ZW5teXBranFsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY5MjUxOTYzMywiZXhwIjoyMDA4MDk1NjMzfQ.i-QsgcR7aZTxpubO0dHGPs-li50B7GrVQKsuW866YLA',
      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpocGxrdGFvdnB5ZW5teXBranFsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY5MjUxOTYzMywiZXhwIjoyMDA4MDk1NjMzfQ.i-QsgcR7aZTxpubO0dHGPs-li50B7GrVQKsuW866YLA',
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
    if (axios.isAxiosError(error)){
      console.error("error:",error.response?.data  || error.message)
    }else{
      console.error("Unexpected error:",error);
    }

    return { status: 500, message: "Error creating invoice" };
  }
  
}

export const uploadInvoiceToSupabase = async (file:File) => {
  const Iconfig = {
    method : "POST",
    maxBodyLength : Infinity,
    url :  `https://zhplktaovpyenmypkjql.supabase.co/storage/v1/object/iwt_invoice_file/Dec_2024/${file.name}`,
    headers : {
      "Authorization" :  'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpocGxrdGFvdnB5ZW5teXBranFsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY5MjUxOTYzMywiZXhwIjoyMDA4MDk1NjMzfQ.i-QsgcR7aZTxpubO0dHGPs-li50B7GrVQKsuW866YLA',
      "Content-Type"  : file.type
    },
    data : file
  };

  try{
    const response = await axios(Iconfig);
    console.log('Iconfig response :',response)

    if (response.status === 200){
      //Extract the file path 
      const fileKey = response.data.file;
      const publicUrl = `https://zhplktaovpyenmypkjql.supabase.co/storage/v1/object/iwt_invoice_file/Dec_2024/${fileKey}`;
      return publicUrl;
    }else{
      throw new Error('File Upload Failed')
    }
   }catch (error) {
    console.error('Error in Tconfig',error)
  }
}

// End of Invoice

// Start of Contract

export const createContractPage = async (c: ContractRequest): Promise<{status:number; message:string}> => {
  let data = JSON.stringify([
    {
      client_id: c.client_id,
      contract_no : c.contract_no,
      billing_value: c.billing_value,
      billing_start_date : c.billing_start_date,
      billing_end_date : c.billing_end_date,
      billing_months : c.billing_months,
      associatedAccountManager : c.associatedAccountManager,
      status:null,
      contract_file_location:null,
      associated_user_id:c.associated_user_id


    }
  ]);
  console.log("APIData:" + data);
  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'https://zhplktaovpyenmypkjql.supabase.co/rest/v1/contract',
    headers: {
      'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpocGxrdGFvdnB5ZW5teXBranFsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY5MjUxOTYzMywiZXhwIjoyMDA4MDk1NjMzfQ.i-QsgcR7aZTxpubO0dHGPs-li50B7GrVQKsuW866YLA',
      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpocGxrdGFvdnB5ZW5teXBranFsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY5MjUxOTYzMywiZXhwIjoyMDA4MDk1NjMzfQ.i-QsgcR7aZTxpubO0dHGPs-li50B7GrVQKsuW866YLA',
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
    if (axios.isAxiosError(error)){
      console.error("error:",error.response?.data  || error.message)
    }else{
      console.error("Unexpected error:",error);
    }

    return { status: 500, message: "Error Submitting Contract" };
  }
  
}

export const uploadContractToSupabase = async (file:File) => {
  const Cconfig = {
    method : "POST",
    maxBodyLength : Infinity,
    url : `https://zhplktaovpyenmypkjql.supabase.co/storage/v1/object/iwt_contracts/${file.name}` ,
    headers : {
      'Authorization' : 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpocGxrdGFvdnB5ZW5teXBranFsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY5MjUxOTYzMywiZXhwIjoyMDA4MDk1NjMzfQ.i-QsgcR7aZTxpubO0dHGPs-li50B7GrVQKsuW866YLA',
      'Content-Type' : file.type
    },
    data : file,
  };
  try{
    const response = await axios(Cconfig);
    console.log('uploade response',response)

    if (response.status === 200){
      //Extract the file path 
      const fileKey = response.data.file;
      const publicUrl = `https://zhplktaovpyenmypkjql.supabase.co/storage/v1/object/iwt_contracts/${fileKey}`;
      return publicUrl;
    }else{
      throw new Error('Contract Upload Failed')
    }
   }catch (error) {
    console.error('Error in Contractconfig',error)
  }
    
}
// End of Contract



// for Claim

export const createClaimPage = async (c: ClaimRequest): Promise<{status:number; message:string}> => {
  let data = JSON.stringify([
    {
      expenseType: c.expenseType,
      expenseDate: c.expenseDate,
      expenseBy: c.expenseBy,
      expenseAmount: c.expenseAmount,
      expenseApprovalStatus:false,
      expenseApprovedBy:null,
      expenseApprovedDate:null,
      expenseApprovedAmount:null,
      externalTransactionId:null,
      originalTransactionDate:null,
      externalTransactionNarration:c.expenseTypeDesc,
      associatedUserId:c.associatedUserId,


    }
  ]);
  console.log("APIData:" + data);
  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'https://zhplktaovpyenmypkjql.supabase.co/rest/v1/expenses',
    headers: {
      'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpocGxrdGFvdnB5ZW5teXBranFsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY5MjUxOTYzMywiZXhwIjoyMDA4MDk1NjMzfQ.i-QsgcR7aZTxpubO0dHGPs-li50B7GrVQKsuW866YLA',
      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpocGxrdGFvdnB5ZW5teXBranFsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY5MjUxOTYzMywiZXhwIjoyMDA4MDk1NjMzfQ.i-QsgcR7aZTxpubO0dHGPs-li50B7GrVQKsuW866YLA',
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
    if (axios.isAxiosError(error)){
      console.error("error:",error.response?.data  || error.message)
    }else{
      console.error("Unexpected error:",error);
    }

    return { status: 500, message: "Error Submitting Claim" };
  }
  
}

export const uploadClaimsToSupabase = async (file:File) => {
  const Cconfig = {
    method : "POST",
    maxBodyLength : Infinity,
    url : `https://zhplktaovpyenmypkjql.supabase.co/storage/v1/object/iwt_claims/${file.name}` ,
    headers : {
      'Authorization' : 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpocGxrdGFvdnB5ZW5teXBranFsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY5MjUxOTYzMywiZXhwIjoyMDA4MDk1NjMzfQ.i-QsgcR7aZTxpubO0dHGPs-li50B7GrVQKsuW866YLA',
      'Content-Type' : file.type
    },
    data : file,
  };
  try{
    const response = await axios(Cconfig);
    console.log('uploade response',response)

    if (response.status === 200){
      //Extract the file path 
      const fileKey = response.data.file;
      const publicUrl = `https://zhplktaovpyenmypkjql.supabase.co/storage/v1/object/iwt_claims/${fileKey}`;
      return publicUrl;
    }else{
      throw new Error('Claim Upload Failed')
    }
   }catch (error) {
    console.error('Error in Cconfig',error)
  }
    
}
/// End of claim

//  Start of Timesheet
export const uploadFileToSupabase = async (file:File) => {
     const Tconfig = {
      method : "POST",
      maxBodyLength : Infinity,
      url : `https://zhplktaovpyenmypkjql.supabase.co/storage/v1/object/iwt_timesheets/${file.name}`,
      headers : {
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpocGxrdGFvdnB5ZW5teXBranFsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY5MjUxOTYzMywiZXhwIjoyMDA4MDk1NjMzfQ.i-QsgcR7aZTxpubO0dHGPs-li50B7GrVQKsuW866YLA',
        'Content-Type': file.type,
      },
      data : file,
     };

     try{
      const response = await axios(Tconfig);
      console.log('uploade response',response)

      if (response.status === 200){
        //Extract the file path 
        const fileKey = response.data.file;
        const publicUrl = `https://zhplktaovpyenmypkjql.supabase.co/storage/v1/object/iwt_timesheets/${fileKey}`;
        return publicUrl;
      }else{
        throw new Error('Timesheet Upload Failed')
      }
     }catch (error) {
      console.error('Error in Tconfig',error)
    }
}


export const createEmployeeTimesheet = async (t: TimesheetRequest): Promise<{status:number; message:string}> => {
  const data = JSON.stringify([
    {
      employeeId: t.employeeId,
      employeeName: t.employeeName,
      employeeClient: t.employeeClient,
      timesheetMonthYear: t.timesheetMonthYear,
      workingDays:t.workingDays,
      holidayDays: t.holidayDays,
      holidayDates: t.holidayDates,
      leaveDays: t.leaveDays,
      leaveDates: t.leaveDates,
      approved:false,
      approvedBy:null,
      approvedDate:null,
      sentToFinance:false,
      timesheetFileLocation:null,
      createdBy: t.createdBy
    }
  ]);
  console.log("APIData:" + data);
  const config = {
    method: 'post',
    url: 'https://zhplktaovpyenmypkjql.supabase.co/rest/v1/employeeTimesheet',
    headers: {
      'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpocGxrdGFvdnB5ZW5teXBranFsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY5MjUxOTYzMywiZXhwIjoyMDA4MDk1NjMzfQ.i-QsgcR7aZTxpubO0dHGPs-li50B7GrVQKsuW866YLA', // Use environment variable
      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpocGxrdGFvdnB5ZW5teXBranFsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY5MjUxOTYzMywiZXhwIjoyMDA4MDk1NjMzfQ.i-QsgcR7aZTxpubO0dHGPs-li50B7GrVQKsuW866YLA', // Use environment variable
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
    console.error("Error creating timesheet:", error);
    return { status: 500, message: "Error occurred while creating timesheet" }; // Return an object
  }
};

export const getEmployeeTimesheet = async () : Promise<ListOfTimesheet> => {
  let response: ListOfTimesheet = {
    status: 0,
    createdAt: "",
    employeeId: "",
    employeeName: "",
    employeeClient: "",
    timesheetMonthYear: "",
    workingDays: "",
    workingDates: "",
    holidayDays: "",
    holidayDates: "",
    leaveDays: "",
    leaveDates: "",
    createdBy: "",
    approved: false,
    approvedDate: new Date,
    sentToFinance: false,
    timesheetFileLocation: "",
    length: 0
  }
  const d = await axios
    .get(`${GET_TIMESHEET_URL}?approved=eq.FALSE`);
  response = d.data;
  return response;
}
// end of timesheet
export * as apiHelper from './apiHelper.ts';
