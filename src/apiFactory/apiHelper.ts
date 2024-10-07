import axios from "axios";
import { resourceLimits } from "worker_threads";
import { EmployeeOnboardingResponse, Salary, UsersQueryResponse } from "../app/modules/apps/user-management/users-list/core/_models.ts";
import { ListOfTimesheet } from "../app/modules/apps/user-management/users-list/core/_models.ts";
import { TimesheetRequest } from "../app/modules/apps/user-management/users-list/core/_models.ts";
import { create } from "domain";

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
const GET_USER_SALARY_URL = `${API_URL}/salary`;
const GET_USER_SALARY_DETAIL_URL = `${API_URL}/salaryDetails`;
const GET_USER_BILLING_URL = `${API_URL}/billing`;
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

// Billing Data

export const getBillingTotalValue = async () => {
  try {
    const response = await axiosInstance.get('billing?select=*');
    return response;
  } catch (error) {
    console.error('Error fetching data:', error);
    return null
  }
};

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
    const response = await axiosInstance.get('salary?billing=*, user(id,*), client(id,*)', { timeout: 1500 });
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
    .get(`${GET_USERS_URL}?select=id,username,email,firstName,lastName,occupation,companyName,phone,employeeJoiningDate,employeeId&isClientFacing=eq.1&order=id`);
  return d;
};

export const getPeerEmployees = async (clientId: string): Promise<UsersQueryResponse> => {
  const d = await axios
    .get(`${GET_USERS_URL}?select=id,username,email,firstName,lastName,occupation,companyName,phone,employeeJoiningDate,employeeId,salary(user_id,*),billing(associated_user_id,*)&isClientFacing=eq.1&order=id&clientId=eq.${clientId}`);
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
    .get(`${GET_USER_BILLING_URL}?id=eq.${associated_user_id}`);
  return d;
};

export const getEmployeeInvoiceInfo = async (associated_user_id: string): Promise<any> => {
  const d = await axios
    .get(`${GET_EMPLOYEEINVOICE_URL}?invoice_against_user_id=eq.${associated_user_id}`);
  return d;
};

export const getEmployeesForOnboarding = async (): Promise<EmployeeOnboardingResponse> => {
  let response: EmployeeOnboardingResponse = {}
  const d = await axios
    .get(`${GET_EMPLOYEEONBOARDING_URL}?select=*,resourceOnboardingStatus(id,*), resource_end_client(id,*)`);
  response = d;
  return response;
};

export const createEmployeeTimesheet = async (t: TimesheetRequest): Promise<TimesheetRequest> => {
  let data = JSON.stringify([
    {
      "employeeId": t.employeeId,
      "employeeName": t.employeeName,
      "employeeClient": t.employeeClient,
      "timesheetMonthYear": t.timesheetMonthYear,
      "workingDays": t.workingDays,
      "workingDates": t.workingDates,
      "holidayDays": t.holidayDays,
      "holidayDates": t.holidayDates,
      "leaveDays": t.leaveDays,
      "leaveDates": t.leaveDates,
      "createdBy": t.createdBy
    }
  ]);

  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'https://zhplktaovpyenmypkjql.supabase.co/rest/v1/employeeTimesheet?select=*',
    headers: {
      'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpocGxrdGFvdnB5ZW5teXBranFsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY5MjUxOTYzMywiZXhwIjoyMDA4MDk1NjMzfQ.i-QsgcR7aZTxpubO0dHGPs-li50B7GrVQKsuW866YLA',
      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpocGxrdGFvdnB5ZW5teXBranFsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY5MjUxOTYzMywiZXhwIjoyMDA4MDk1NjMzfQ.i-QsgcR7aZTxpubO0dHGPs-li50B7GrVQKsuW866YLA',
      'Content-Type': 'application/json'
    },
    data: data
  };

  const response = await axios.request(config)
    .then((response) => 
      {
        if(response.status === 201)
          {
            response.data = "Success"
          }
          else
          {
            response.data = "Failed"
          }
        return response
      })
    .catch((error) => 
      {
        console.log(error);
        return error
      });
      return response;
}

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

export * as apiHelper from './apiHelper.ts';
