import axios, { isAxiosError } from "axios";
import { resourceLimits } from "worker_threads";
import { AddTypeSalary, ClaimRequest, ContractRequest, EmployeeOnboardingResponse, InvoiceRequest, National_id, PastUser, Proposal, Salary, temEmp, User, UsersQueryResponse } from "../app/modules/apps/user-management/users-list/core/_models.ts";
import { ListOfTimesheet } from "../app/modules/apps/user-management/users-list/core/_models.ts";
import { TimesheetRequest } from "../app/modules/apps/user-management/users-list/core/_models.ts";
import { UserModel } from "../../src/app/modules/auth/core/_models.ts";
import { create } from "domain";
import { file } from "@form-validation/bundle/popular";
import { url } from "inspector";
import { error } from "console";
import { string } from "yup";
import dayjs from "dayjs";
import { EOF } from "dns";
import { getUsersByLoginId } from "../app/modules/auth/core/_requests.ts";
import { UserEmployeeIdCell } from "../app/modules/apps/user-management/users-list/table/columns/UserEmployeeIdCell.tsx";
import { getAccountManagerId, getLoggedUser, getUserId } from "../app/modules/auth/core/_authStore.ts";
import { getLogger } from "react-query/types/core/logger";



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


const update_ClaimDate = today.toLocaleDateString("en-IN",{
  year: "numeric",
  month: "short",
}).replace(/\//g, "_");

// User Count
const axiosInstance = axios.create({
  baseURL: `${API_URL}`,
  headers: {
    'apikey': `${axios.defaults.headers.common['apikey']}`,
    'Authorization': `${axios.defaults.headers.common['Authorization']}`
  }
});
const axiosSupaFuncInstance = axios.create({
  baseURL: 'https://zhplktaovpyenmypkjql.supabase.co/functions/v1',
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

export const getUserCount = async () => {
  try{
    const response = await axiosEncoreInstance.get("/userCount")
 //   console.log("Response for Count User :", response.data)
    return response.data;
  }catch(error){
    if(axios.isAxiosError(error)){
       console.log("Error in getting UserCount :" , error.response?.data || error.message )
    }else{
      console.log("Error in getiiin UserCount : ", error)
    }
  }
    
  
};

// Contract Data

export const getInvoiceTotalValue = async () => {
  try{
    const response = await axiosEncoreInstance.get("/invoiceValue", { timeout : 3500 } )
  //  console.log("Response for getInvoiceValue  :", response.data)
    return response.data.invoiceValue;
  }catch(error){
    if(axios.isAxiosError(error)){
       console.log("Error in getting getInvoiceValue  :" , error.response?.data || error.message )
    }else{
      console.log("Error in getiiin getInvoiceValue  : ", error)
    }
  }
};
//Fetching the Contract Expiries
export const getContractExpiries = async () => {
  try{
    const response = await axiosEncoreInstance.get("/expContract", { timeout : 3500 } )
  //  console.log("Response for getInvoiceValue  :", response.data)
    return response.data;
  }catch(error){
    if(axios.isAxiosError(error)){
       console.log("Error in getting getContractExpiries  :" , error.response?.data || error.message )
    }else{
      console.log("Error in getiiin getContractExiries  : ", error)
    }
  }
}
// Fetching the data related to national_id
export const getNationalIdExp = async () => {
  try{
    const response = await axiosEncoreInstance.get("/expNationalId", { timeout : 3500 } )
  //  console.log("Response for getInvoiceValue  :", response.data)
    return response.data;
  }catch(error){
    if(axios.isAxiosError(error)){
       console.log("Error in getting getNationalIdExp  :" , error.response?.data || error.message )
    }else{
      console.log("Error in getiiin getNationalIdExp  : ", error)
    }
  }
}
//Fetch the data related to Invoices
export const getInvoiceDetails = async () => {
  try{
    const response = await axiosEncoreInstance.get("/invDetails", { timeout : 3500 } )
  //  console.log("Response for getInvoiceValue  :", response.data)
    return response.data;
  }catch(error){
    if(axios.isAxiosError(error)){
       console.log("Error in getting getInvoiceDetails  :" , error.response?.data || error.message )
    }else{
      console.log("Error in getiiin getInvoiceDetails  : ", error)
    }
  }
}
// Fetch all proposals
export const getProposals = async () => {
  try{
     const response = await axiosInstance.get('/proposals')
    //  console.log("this is the response from getProposals :", response.data)
     return response.data
  }catch(error){
    if(axios.isAxiosError(error)){
      console.error("Error in getting getProposals : ",error.response?.data || error.message )
    }else{
      console.error("Error in fetching getProposals : ", error)
    }
  }
} 
// Fetch Past Employees 
export const getPastEmplouees = async () => {
  try{
     const response = await axiosInstance.get('/pastEmployees')
    //  console.log("this is the response from getProposals :", response.data)
     return response.data
  }catch(error){
    if(axios.isAxiosError(error)){
      console.error("Error in getting pastEmployee : ",error.response?.data || error.message )
    }else{
      console.error("Error in fetching pastEmployee : ", error)
    }
  }
} 
// Fetching the data related to national_id
export const getLeavesLeft = async () => {
  try{
    const response = await axiosEncoreInstance.get("/leavesLeft", { timeout : 3500 } )
  //  console.log("Response for getInvoiceValue  :", response.data)
    return response.data;
  }catch(error){
    if(axios.isAxiosError(error)){
       console.log("Error in getting getLeavesLeftDetails  :" , error.response?.data || error.message )
    }else{
      console.log("Error in getiiin getLeavesLeftDetails  : ", error)
    }
  }
}

// Opportunities Data
export const getAllOpportunities = async () => {
  try{
    const response = await axiosEncoreInstance.get("/allOpportunities", { timeout : 3500 } )
  //  console.log("Response for getInvoiceValue  :", response.data)
    return response.data;
  }catch(error){
    if(axios.isAxiosError(error)){
       console.log("Error in getting getAllOpportunitiesDetails  :" , error.response?.data || error.message )
    }else{
      console.log("Error in getiiin getAllOpportunitiesDetails  : ", error)
    }
  }
};

// Salary Data
export const getAllSalaries = async () => {
  try{
    const response = await axiosEncoreInstance.get("/allSalaries", { timeout : 3500 } )
  //  console.log("Response for getInvoiceValue  :", response.data)
    return response.data;
  }catch(error){
    if(axios.isAxiosError(error)){
       console.log("Error in getting getAllSalariesDetails  :" , error.response?.data || error.message )
    }else{
      console.log("Error in getiiin getAllSalariesDetails  : ", error)
    }
  }
};

//Billing Data
export const getAllBilling = async () => {
  try{
    const response = await axiosEncoreInstance.get("/allBillings", { timeout : 3500 } )
  //  console.log("Response for getInvoiceValue  :", response.data)
    return response.data;
  }catch(error){
    if(axios.isAxiosError(error)){
       console.log("Error in getting getAllBillingsDetails  :" , error.response?.data || error.message )
    }else{
      console.log("Error in getiiin getAllBillingsDetails  : ", error)
    }
  }
};

// API for pending Invoices
export const getPendingInvoices = async () => {
  try{
    const response = await axiosEncoreInstance.get("/getPendingInv", { timeout : 3500 } )
  //  console.log("Response for getInvoiceValue  :", response.data)
    return response.data.pendingInv;
  }catch(error){
    if(axios.isAxiosError(error)){
       console.log("Error in getting getPending Invoices  :" , error.response?.data || error.message )
    }else{
      console.log("Error in getiiin getPending Invoices  : ", error)
    }
  }
};

// Api for paid invoices
export const getPaidInvoices = async () => {
  try{
    const response = await axiosEncoreInstance.get("/getPaidInv", { timeout : 3500 } )
  //  console.log("Response for getInvoiceValue  :", response.data)
    return response.data.paidInv;
  }catch(error){
    if(axios.isAxiosError(error)){
       console.log("Error in getting getPaid Invoices  :" , error.response?.data || error.message )
    }else{
      console.log("Error in getiiin getPaid Invoices  : ", error)
    }
  }
};

export const getSalaryInfoByEmployee = async (id: any) => {
  try{
    const response = await axiosEncoreInstance.get(`/empSalInfo?id=${id}`, { timeout : 1500 } )
  //  console.log("Response for getSalaryInfoByEmployee  :", response.data)
    return response.data;
  }catch(error){
    if(axios.isAxiosError(error)){
       console.log("Error in getting getSalaryInfoByEmployee   :" , error.response?.data || error.message )
    }else{
      console.log("Error in getiiin getSalaryInfoByEmployee  : ", error)
    }
  }
};

// For iqama in Action cell 
export const getIqamaForAction = async (id: string) => {
  try {
    let url = "";
    const loggedUser =  getLoggedUser(); // Get the currently logged-in user
    //console.log("From api Helper:", loggedUser)
    if (loggedUser === `${admin}`) {
      // Admin case
      url = `nationalIdInfo?associated_user_id=eq.${id}&select=id,national_id,expiry_date,associated_user_id(username,email)`;
    } else if (loggedUser === null ) {
      // null Case
      url = `nationalIdInfo?associated_user_id=eq.${id}&select=id,national_id,expiry_date,associated_user_id(username,email)`;
    }  else {
      // Account Manager case
      const accountManagerId = await getAccountManagerId();
      //console.log("This is Account Manager Id: ", accountManagerId);
      url = `nationalIdInfo?associated_user_id=eq.${id}&select=id,national_id,expiry_date,associated_user_id(username,email)&associated_account_manager=eq.${accountManagerId}`;
    }
    const { data } = await axiosInstance.get(url);
    return  data[0];
  }
  catch (error) {
    console.error("Error fetching data: ", error);
  }
};
// For Contract in Action cell 
export const getContractForAction = async (id: string) => {
  try {
    let url = "";
    const loggedUser =  getLoggedUser(); // Get the currently logged-in user
    //console.log("From api Helper:", loggedUser)
    if (loggedUser === `${admin}`) {
      // Admin case
      url = `contract?associated_user_id=eq.${id}&select=id,client_id(client_name),contract_no,billing_months,associatedAccountManager(accountManagerName),contract_date,contract_end_date,billing_value,associated_user_id(username,email)`;
    } else if (loggedUser === null ) {
      // null Case
      url = `contract?associated_user_id=eq.${id}&select=id,client_id(client_name),contract_no,billing_months,associatedAccountManager(accountManagerName),contract_date,contract_end_date,billing_value,associated_user_id(username,email)`;
    }  else {
      // Account Manager case
      const accountManagerId = await getAccountManagerId();
      //console.log("This is Account Manager Id: ", accountManagerId);
      url = `contract?associated_user_id=eq.${id}&select=id,client_id(client_name),contract_no,billing_months,associatedAccountManager(accountManagerName),contract_date,contract_end_date,billing_value,associated_user_id(username,email)&associatedAccountManager=eq.${accountManagerId}`;
    }
    const { data } = await axiosInstance.get(url);
    return  data[0];
  }
  catch (error) {
    if (axios.isAxiosError(error)){
      console.log("This is the error from getContract :", error.response?.data || error.message)
    }
    console.error("Error fetching data: ", error);
  }
};


export const getAllEmployees = async () => {
  try{
    const response = await axiosEncoreInstance.get('/getAllEmp')
    // console.log("Response for getAllEmployee  :", response.data)
    return response.data.getAllEmp;
  }catch(error){
    if(axios.isAxiosError(error)){
       console.log("Error in getting getAllEmployee   :" , error.response?.data || error.message )
    }else{
      console.log("Error in getiiin getAllEmployee  : ", error)
    }
  }
};

export const getAllClaimEmployees = async () => {
   try{
    const response = await axiosEncoreInstance.get('/getAllClaimEmp')
   // console.log("Response for getAllClaimEmployee  :", response.data)
    return response.data.getAllClaimEmp;
  }catch(error){
    if(axios.isAxiosError(error)){
       console.log("Error in getting getAllClaimEmployee   :" , error.response?.data || error.message )
    }else{
      console.log("Error in getiiin getAllClaimEmployee  : ", error)
    }
  }
};

export const getAllExpenses = async () => {
  try{
    const response = await axiosInstance.get("/expenses?select=*,associatedUserId(fullName),expenseApprovedBy(accountManagerName),expenseType(expenseTypeDesc)", { timeout : 3500 } )
  console.log("Response for Count User :", response.data)
    return response.data;
  }catch(error){
    if(axios.isAxiosError(error)){
       console.log("Error in getting all Expenses :" , error.response?.data || error.message )
    }else{
      console.log("Error in getiiin Expenses : ", error)
    }
  }
}

export const getEmpForSalaryIncrement = async () => {
   try{
    const response = await axiosEncoreInstance.get('/getEmpForSalInc')
  //  console.log("Response for getEmpForSalInc  :", response.data)
    return response.data.getEmpForSalInc;
  }catch(error){
    if(axios.isAxiosError(error)){
       console.log("Error in getting getEmpForSalInc   :" , error.response?.data || error.message )
    }else{
      console.log("Error in getiiin getEmpForSalInc  : ", error)
    }
  }
}
export const getEmpForSalary = async () => {
   try{
    const response = await axiosEncoreInstance.get('/getEmpForSalary')
  //  console.log("Response for getExpType  :", response.data)
    return response.data.getEmpSal;
  }catch(error){
    if(axios.isAxiosError(error)){
       console.log("Error in getting getEmpSal   :" , error.response?.data || error.message )
    }else{
      console.log("Error in getiiin getEmpSal  : ", error)
    }
  }
}

export const getExpenses = async () => {
   try{
    const response = await axiosEncoreInstance.get('/getExpType')
    // console.log("Response for getEmpSal  :", response.data.getExpType)
    return response.data.getExpType ;
  }catch(error){
    if(axios.isAxiosError(error)){
       console.log("Error in getting getExpType   :" , error.response?.data || error.message )
    }else{
      console.log("Error in getiiin getExpType  : ", error)
    }
  }
};

export const getAccountManager = async () => {
   try{
    const response = await axiosEncoreInstance.get('/getAllAccMgr')
    //  console.log("Response for getEmpSal  :", response.data.getAccMgr)
    return response.data.getAccMgr ;
  }catch(error){
    if(axios.isAxiosError(error)){
       console.log("Error in getting getExpType   :" , error.response?.data || error.message )
    }else{
      console.log("Error in getiiin getExpType  : ", error)
    }
  }
}

export const getPeerEmployees = async (client_id: string): Promise<UsersQueryResponse> => {
  let url = "";
  const loggedUser =  getLoggedUser(); // Get the currently logged-in user
  //console.log("From api Helper:", loggedUser)
  if (loggedUser === `${admin}`) {
    // Admin case
    url = `${GET_USERS_URL}?select=id,username,email,firstName,lastName,occupation,companyName,phone,employeeJoiningDate,employeeId,contract_id,salary(user_id,*),contract(associated_user_id,*)&isClientFacing=eq.1&order=id&client_id=eq.${client_id}`;
  } else if (loggedUser === null ) {
    // null Case
    url = `${GET_USERS_URL}?select=id,username,email,firstName,lastName,occupation,companyName,phone,employeeJoiningDate,employeeId,contract_id,salary(user_id,*),contract(associated_user_id,*)&isClientFacing=eq.1&order=id&client_id=eq.${client_id}`;
  }  else {
    // Account Manager case
    const accountManagerId = await getAccountManagerId();
    //console.log("This is Account Manager Id: ", accountManagerId);
    url = `${GET_USERS_URL}?select=id,username,email,firstName,lastName,occupation,companyName,phone,employeeJoiningDate,employeeId,contract_id,salary(user_id,*),contract(associated_user_id,*)&isClientFacing=eq.1&order=id&client_id=eq.${client_id}&associated_account_manager=eq.${accountManagerId}`;
  }
  const d = await axios
    .get(url);
  return d;
};

export const getEmployeeInfo = async (employeeId: string): Promise<UsersQueryResponse> => {
  let url = "";
  const loggedUser =  getLoggedUser(); // Get the currently logged-in user
  //console.log("From api Helper:", loggedUser)
  if (loggedUser === `${admin}`) {
    // Admin case
    url = `${GET_USERS_URL}?id=eq.${employeeId}`;
  } else if (loggedUser === null ) {
    // null Case
    url = `${GET_USERS_URL}?id=eq.${employeeId}`;
  }  else {
    // Account Manager case
    const accountManagerId = await getAccountManagerId();
    //console.log("This is Account Manager Id: ", accountManagerId);
    url = `${GET_USERS_URL}?id=eq.${employeeId}&associated_account_manager=eq.${accountManagerId}`;
  }
  const d = await axios
    .get(url);
  return d;
};

export const getEmployeeSalaryInfo = async (employeeId: string): Promise<any> => {
  let url = "";
  const loggedUser =  getLoggedUser(); // Get the currently logged-in user
  //console.log("From api Helper:", loggedUser)
  if (loggedUser === `${admin}`) {
    // Admin case
    url = `${GET_USER_SALARY_URL}?id=eq.${employeeId}`;
  } else if (loggedUser === null ) {
    // null Case
    url = `${GET_USER_SALARY_URL}?id=eq.${employeeId}`;
  }  else {
    // Account Manager case
    const accountManagerId = await getAccountManagerId();
    //console.log("This is Account Manager Id: ", accountManagerId);
    url = `${GET_USER_SALARY_URL}?id=eq.${employeeId}&associated_account_manager=eq.${accountManagerId}`;
  }
  const d = await axios
    .get(url);
  return d;
};

export const getEmployeeSalaryDetailInfo = async (employeeId: string): Promise<any> => {
  let url = "";
  const loggedUser =  getLoggedUser(); // Get the currently logged-in user
 // console.log("From api Helper:", loggedUser)
  if (loggedUser === `${admin}`) {
    // Admin case
    url = `${GET_USER_SALARY_DETAIL_URL}?associated_user_id=eq.${employeeId}`;
  } else if (loggedUser === null ) {
    // null Case
    url = `${GET_USER_SALARY_DETAIL_URL}?associated_user_id=eq.${employeeId}`;
  }  else {
    // Account Manager case
    const accountManagerId = await getAccountManagerId();
   // console.log("This is Account Manager Id: ", accountManagerId);
    url = `${GET_USER_SALARY_DETAIL_URL}?associated_user_id=eq.${employeeId}&associated_account_manager=eq.${accountManagerId}`;
  }
  const d = await axios
    .get(url);
  return d;
};

export const getEmployeeBillingInfo = async (associated_user_id: string): Promise<any> => {
  let url = "";
  const loggedUser =  getLoggedUser(); // Get the currently logged-in user
  //console.log("From api Helper:", loggedUser)
  if (loggedUser === `${admin}`) {
    // Admin case
    url = `${GET_USER_CONTRACT_URL}?id=eq.${associated_user_id}`;
  } else if (loggedUser === null ) {
    // null Case
    url = `${GET_USER_CONTRACT_URL}?id=eq.${associated_user_id}`;
  }  else {
    // Account Manager case
    const accountManagerId = await getAccountManagerId();
    //console.log("This is Account Manager Id: ", accountManagerId);
    url = `${GET_USER_CONTRACT_URL}?id=eq.${associated_user_id}&associated_account_manager=eq.${accountManagerId}`;
  }
  const d = await axios
    .get(url);
  return d;
};

export const getEmployeeInvoiceInfo = async (associated_user_id: string): Promise<any> => {
  let url = "";
  const loggedUser =  getLoggedUser(); // Get the currently logged-in user
  //console.log("From api Helper:", loggedUser)
  if (loggedUser === `${admin}`) {
    // Admin case
    url = `${GET_EMPLOYEEINVOICE_URL}?associated_user_id=eq.${associated_user_id}`;
  } else if (loggedUser === null ) {
    // null Case
    url = `${GET_EMPLOYEEINVOICE_URL}?associated_user_id=eq.${associated_user_id}`;
  }  else {
    // Account Manager case
    const accountManagerId = await getAccountManagerId();
    //console.log("This is Account Manager Id: ", accountManagerId);
    url = `${GET_EMPLOYEEINVOICE_URL}?associated_user_id=eq.${associated_user_id}&associated_account_manager=eq.${accountManagerId}`;
  }
  const d = await axios
    .get(url);
  return d;
};

export const getEmployeesForOnboarding = async (): Promise<EmployeeOnboardingResponse> => {
  let response: EmployeeOnboardingResponse = {}
  let url = "";
  const loggedUser =  getLoggedUser(); // Get the currently logged-in user
  //console.log("From api Helper:", loggedUser)
  if (loggedUser === `${admin}`) {
    // Admin case
    url = `${GET_EMPLOYEEONBOARDING_URL}?select=*,resourceOnboardingStatus(id,*), resource_end_client(id,*)`;
  } else if (loggedUser === null ) {
    // null Case
    url = `${GET_EMPLOYEEONBOARDING_URL}?select=*,resourceOnboardingStatus(id,*), resource_end_client(id,*)`;
  }  else {
    // Account Manager case
    const accountManagerId = await getAccountManagerId();
    //console.log("This is Account Manager Id: ", accountManagerId);
    url = `${GET_EMPLOYEEONBOARDING_URL}?select=*,resourceOnboardingStatus(id,*), resource_end_client(id,*)&associated_account_manager=eq.${accountManagerId}`;
  }
  const d = await axios
    .get(url);
  response = d;
  return response;
};

export const getEmpOccupation = async () => {
}

export const getClientDetails = async () : Promise<any> => {
  let url = "";
  const loggedUser =  getLoggedUser(); // Get the currently logged-in user
  //console.log("From api Helper:", loggedUser)
  if (loggedUser === `${admin}`) {
    // Admin case
    url = `${GET_CLIENT_DETAILS_URL}?select=*&order=id`;
  } else if (loggedUser === null ) {
    // null Case
    url = `${GET_CLIENT_DETAILS_URL}?select=*&order=id`;
  }  else {
    // Account Manager case
    const accountManagerId = await getAccountManagerId();
  //  console.log("This is Account Manager Id: ", accountManagerId);
    url = `${GET_CLIENT_DETAILS_URL}?select=*&order=id&associated_account_manager=eq.${accountManagerId}`;
  }
  const d =  await axios
    .get(url);
  return d;
};

export const getContractDetails = async () : Promise<any> => {
  let url = "";
  const loggedUser =  getLoggedUser(); // Get the currently logged-in user
  //console.log("From api Helper:", loggedUser)
  if (loggedUser === `${admin}`) {
    // Admin case
    url = `${GET_USER_CONTRACT_URL}?select=*,associated_user_id(*)&order=id`;
  } else if (loggedUser === null ) {
    // null Case
    url = `${GET_USER_CONTRACT_URL}?select=*,associated_user_id(*)&order=id`;
  }  else {
    // Account Manager case
    const accountManagerId = await getAccountManagerId();
  //  console.log("This is Account Manager Id: ", accountManagerId);
    url = `${GET_USER_CONTRACT_URL}?select=*,associated_user_id(*)&order=id&associatedAccountManager=eq.${accountManagerId}`;
  }
  const d =  await axios
    .get(url);
  return d;
};

export const getTempUserDetails = async () : Promise<any> => {
  let url = "";
  const loggedUser =  getLoggedUser(); // Get the currently logged-in user
 // console.log("From api Helper:", loggedUser)
  if (loggedUser === `${admin}`) {
    // Admin case
    url = `${GET_TEMP_USERS_URL}?select=*&order=id&userId=eq.false`;
  }  else if (loggedUser === null ) {
    // null Case
    url = `${GET_TEMP_USERS_URL}?select=*&order=id&userId=eq.false`;
  }  else {
    // Account Manager case
    const accountManagerId = await getAccountManagerId();
  //  console.log("This is Account Manager Id: ", accountManagerId);
    url = `${GET_TEMP_USERS_URL}?select=*&order=id&userId=eq.false&associatedAccountManager=eq.${accountManagerId}`;
  }
  const d =  await axios
    .get(url);
  return d;
};


// Salary Add  Starts here 

export const AddSalary = async ( s:AddTypeSalary ) : Promise<any> => {
  let data = JSON.stringify([
    {   
        user_id : s.user_id,
        pay_date: s.pay_date,
        pay_period : s.pay_period,
        basic_allowance : s.basic_allowance,
        hr_allowance : s.hr_allowance, 
        end_of_service_allowance : s.end_of_service_allowance,
        travel_other_allowance : s.travel_other_allowance,
        earnings_total : s.earnings_total,
        lop_days : s.lop_days,
        employee_request:s.employee_request,
        salary_advance : s.salary_advance,
        lop_salary_total : s.lop_salary_total,
        total_net_salary : s.total_net_salary,
        total_net_salary_words : s.total_net_salary_words, 
        salary_pay_mode : s.salary_pay_mode, 
        working_days : s. working_days, 
        holidays : s.holidays,
        deductions_total : s.deductions_total, 
        leaves : s.leaves,
        overTime : s.overTime,
    }
  ]);
  
  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: `${API_URL}/salary`,
    headers: { 
      'apikey': `${axios.defaults.headers.common['apikey']}`, 
      'Content-Type': 'application/json', 
      'Authorization': `${axios.defaults.headers.common['Authorization']}`
    },
    data : data
  };
  
  try {
    const response = await axios.request(config);
    
    if (response.status === 204) {
      return { status: response.status, message: "Success" }; // Return an object
    } else {
     return { status: response.status, message: "Failed" }; // Return an object
    }
  } catch (error) {
    if (axios.isAxiosError(error)){
      console.error("error in SalaryUpdate:",error.response?.data  || error.message)
    }else{
      console.error("Unexpected error:",error);
    }
  
    return { status: 500, message: "Successfully Added  Salary Data" };
  }
  }
  // End of salary
  
                  //  Change onSalary  Status from False to True 
                  export const updateOnSalary = async ( s:AddTypeSalary ) : Promise<any> => {
                    let data = JSON.stringify([
                      {   
                          onSalary : true 
                      }
                    ]);
                    
                    let config = {
                      method: 'patch',
                      maxBodyLength: Infinity,
                      url: `${API_URL}/user?id=eq.${s.id}`,
                      headers: { 
                        'apikey': `${axios.defaults.headers.common['apikey']}`, 
                        'Content-Type': 'application/json', 
                        'Authorization': `${axios.defaults.headers.common['Authorization']}`
                      },
                      data : data
                    };
                    
                    try {
                      const response = await axios.request(config);
                      
                      if (response.status === 204) {
                        return { status: response.status, message: "Success" }; // Return an object
                      } else {
                       return { status: response.status, message: "Failed" }; // Return an object
                      }
                    } catch (error) {
                      if (axios.isAxiosError(error)){
                        console.error("error in Updating onSalary to true:",error.response?.data  || error.message)
                      }else{
                        console.error("Unexpected error:",error);
                      }
                    
                      return { status: 500, message: "Successfully Updated onSalary status to true " };
                    }
                    }
                    // End of salary 
                  //End of Change onSalary status fronm false to true 

// Salary update Starts here 

export const updateSalaryIncrement = async ( s:Salary ) : Promise<any> => {
let data = JSON.stringify([
  {
      pay_date: s.pay_date,
      pay_period : s.pay_period,
      basic_allowance : s.basic_allowance,
      hr_allowance : s.hr_allowance, 
      end_of_service_allowance : s.end_of_service_allowance,
      travel_other_allowance : s.travel_other_allowance,
      earnings_total : s.earnings_total,
      lop_days : s.lop_days,
      employee_request:s.employee_request,
      salary_advance : s.salary_advance,
      lop_salary_total : s.lop_salary_total,
      total_net_salary : s.total_net_salary,
      total_net_salary_words : s.total_net_salary_words, 
      salary_pay_mode : s.salary_pay_mode, 
      working_days : s. working_days, 
      holidays : s.holidays,
      deductions_total : s.deductions_total, 
      leaves : s.leaves,
      overTime : s.overTime,
  }
]);

let config = {
  method: 'patch',
  maxBodyLength: Infinity,
  url: `${API_URL}/salary?id=eq.${s.id}`,
  headers: { 
    'apikey': `${axios.defaults.headers.common['apikey']}`, 
    'Content-Type': 'application/json', 
    'Authorization': `${axios.defaults.headers.common['Authorization']}`
  },
  data : data
};

try {
  const response = await axios.request(config);
  
  if (response.status === 204) {
    return { status: response.status, message: "Success" }; // Return an object
  } else {
   return { status: response.status, message: "Failed" }; // Return an object
  }
} catch (error) {
  if (axios.isAxiosError(error)){
    console.error("error in SalaryUpdate:",error.response?.data  || error.message)
  }else{
    console.error("Unexpected error:",error);
  }

  return { status: 500, message: "Successfully Updated Salary Data" };
}
}
// End of salary upda

// Update the Leave Record
export const updateLeaveRecord = async (id : any ,  updatedLeaves: { leaves_used: number; leave_left_current_year: number }) => {
  let data = JSON.stringify([updatedLeaves]);

let config = {
  method: 'patch',
  maxBodyLength: Infinity,
  url: `${API_URL}/leaveEntitlment?id=eq.${id}`,
  headers: { 
    'Authorization': `${axios.defaults.headers.common['Authorization']}`, 
    'apikey': `${axios.defaults.headers.common['apikey']}`, 
    'Content-Type': 'application/json'
  },
  data : data
};

axios.request(config)
.then((response) => {
  console.log(JSON.stringify(response.data));
})
.catch((error) => {
  if(axios.isAxiosError(error)){
    console.error(`Error in updating Leave Record For Id: ${id}` , error.response?.data || error.message) 
  }else{
    console.error("Some Other Error in Updating Leave Record : ", error)
  }
});

}
                
export const updateLeaveRecordStatus = async (id: any) => {
  let data = JSON.stringify([
    {
      isActive : false 
    }
  ]);
  
  let config = {
    method: 'patch',
    maxBodyLength: Infinity,
    url: `${API_URL}/leaveEntitlment?id=eq.${id}`,
    headers: { 
      'Authorization': `${axios.defaults.headers.common['Authorization']}`, 
      'apikey': `${axios.defaults.headers.common['apikey']}`, 
      'Content-Type': 'application/json'
    },
    data : data
  };
  
  axios.request(config)
  .then((response) => {
    console.log(JSON.stringify(response.data));
  })
  .catch((error) => {
    if (axios.isAxiosError(error)){
      console.error("Axios Error in update Invoice Status : ", error.response?.data || error.message)
     }else{
      console.error("Error in updating InvoiceStatus to true " , error)
     }
  });

}
// End of update Leave Record 
// Update Employee Isactive and isClientFacing status 
export const updateUserStatus = async (id: any) => {
  let data = JSON.stringify([
    {
      isActive : false ,
      isClientFacing : false
    }
  ]);
  
  let config = {
    method: 'patch',
    maxBodyLength: Infinity,
    url: `${API_URL}/user?id=eq.${id}`,
    headers: { 
      'Authorization': `${axios.defaults.headers.common['Authorization']}`, 
      'apikey': `${axios.defaults.headers.common['apikey']}`, 
      'Content-Type': 'application/json'
    },
    data : data
  };
  
  axios.request(config)
  .then((response) => {
    console.log(JSON.stringify(response.data));
  })
  .catch((error) => {
    if (axios.isAxiosError(error)){
      console.error("Axios Error in update User Status : ", error.response?.data || error.message)
     }else{
      console.error("Error in updating User to true " , error)
     }
  });

}

//
//update paid Status
export const updateInvoiceStatus =  async (id : any , invoice_paid_amount : any ) => {
  let data = JSON.stringify([
    {
      "invoice_paid_status": true,
      "invoice_paid_date" : today,
      invoice_paid_amount :invoice_paid_amount
    }
  ]);
  
  let config = {
    method: 'patch',
    maxBodyLength: Infinity,
    url: `${API_URL}/invoice?id=eq.${id}`,
    headers: { 
      'Authorization': `${axios.defaults.headers.common['Authorization']}`, 
      'apikey': `${axios.defaults.headers.common['apikey']}`, 
      'Content-Type': 'application/json'
    },
    data : data
  };
  
  axios.request(config)
  .then((response) => {
    console.log(JSON.stringify(response.data));
  })
  .catch((error) => {
    if (axios.isAxiosError(error)){
      console.error("Axios Error in update Invoice Status : ", error.response?.data || error.message)
     }else{
      console.error("Error in updating InvoiceStatus to true " , error)
     }
  });
} 
// end of Update paid status

// Update Proposal Status
export const updateProposalStatus =  async (id : any , newStatus : any ) => {
  let data = JSON.stringify([
    {
      status : newStatus
    }
  ]);
  
  let config = {
    method: 'patch',
    maxBodyLength: Infinity,
    url: `${API_URL}/proposals?id=eq.${id}`,
    headers: { 
      'Authorization': `${axios.defaults.headers.common['Authorization']}`, 
      'apikey': `${axios.defaults.headers.common['apikey']}`, 
      'Content-Type': 'application/json'
    },
    data : data
  };
  
  axios.request(config)
  .then((response) => {
    console.log(JSON.stringify(response.data));
  })
  .catch((error) => {
    if (axios.isAxiosError(error)){
      console.error("Axios Error in update Proposal Status line 927 : ", error.response?.data || error.message)
     }else{
      console.error("Error in updating Proposal Status to true " , error)
     }
  });
} 
// End of Proposal Status  
// Start of Past Employee status 
export const updatePastEmployeeStatus =  async (id : number , newStatus : string ) => {
  let data = JSON.stringify([
    {
      status : newStatus
    }
  ]);
  
  let config = {
    method: 'patch',
    maxBodyLength: Infinity,
    url: `${API_URL}/pastEmployees?id=eq.${id}`,
    headers: { 
      'Authorization': `${axios.defaults.headers.common['Authorization']}`, 
      'apikey': `${axios.defaults.headers.common['apikey']}`, 
      'Content-Type': 'application/json'
    },
    data : data
  };
  
  axios.request(config)
  .then((response) => {
    console.log(JSON.stringify(response.data));
  })
  .catch((error) => {
    if (axios.isAxiosError(error)){
      console.error("Axios Error in update Past Employee  Status line 974 : ", error.response?.data || error.message)
     }else{
      console.error("Error in updating PastEmployee  Status to true " , error)
     }
  });
} 
// End of Update PastEmployee status 
// Start of Update Clearance Letter
export const updateClearanceLetterInDB =  async (id : number , fileUrl : string ) => {
  let data = JSON.stringify([
    {
      clearanceLetter : fileUrl
    }
  ]);
  
  let config = {
    method: 'patch',
    maxBodyLength: Infinity,
    url: `${API_URL}/pastEmployees?id=eq.${id}`,
    headers: { 
      'Authorization': `${axios.defaults.headers.common['Authorization']}`, 
      'apikey': `${axios.defaults.headers.common['apikey']}`, 
      'Content-Type': 'application/json'
    },
    data : data
  };
  
  axios.request(config)
  .then((response) => {
    console.log(JSON.stringify(response.data));
  })
  .catch((error) => {
    if (axios.isAxiosError(error)){
      console.error("Axios Error in update Past Employee  Status line 974 : ", error.response?.data || error.message)
     }else{
      console.error("Error in updating PastEmployee  Status to true " , error)
     }
  });
}  
// End of Update CLearance letter
// Start of Update ExitDate
export const updateExitDateInDB =  async (id : number , newDate : string ) => {
  let data = JSON.stringify([
    {
      employeeExitDate : newDate
    }
  ]);
  
  let config = {
    method: 'patch',
    maxBodyLength: Infinity,
    url: `${API_URL}/pastEmployees?id=eq.${id}`,
    headers: { 
      'Authorization': `${axios.defaults.headers.common['Authorization']}`, 
      'apikey': `${axios.defaults.headers.common['apikey']}`, 
      'Content-Type': 'application/json'
    },
    data : data
  };
  
  axios.request(config)
  .then((response) => {
    console.log(JSON.stringify(response.data));
  })
  .catch((error) => {
    if (axios.isAxiosError(error)){
      console.error("Axios Error in update Past Employee Exit Date Status line 1040 : ", error.response?.data || error.message)
     }else{
      console.error("Error in updating PastEmployee  Exit Date Status to true " , error)
     }
  });
} 
// End Of Update ExitDate
// Start of update no due letter url
export const updateNoDueInDB =  async (id : number , fileUrl : string ) => {
  let data = JSON.stringify([
    {
      noDueLetter : fileUrl
    }
  ]);
  
  let config = {
    method: 'patch',
    maxBodyLength: Infinity,
    url: `${API_URL}/pastEmployees?id=eq.${id}`,
    headers: { 
      'Authorization': `${axios.defaults.headers.common['Authorization']}`, 
      'apikey': `${axios.defaults.headers.common['apikey']}`, 
      'Content-Type': 'application/json'
    },
    data : data
  };
  
  axios.request(config)
  .then((response) => {
    console.log(JSON.stringify(response.data));
  })
  .catch((error) => {
    if (axios.isAxiosError(error)){
      console.error("Axios Error in update Past Employee  Status line 974 : ", error.response?.data || error.message)
     }else{
      console.error("Error in updating PastEmployee  Status to true " , error)
     }
  });
} 
// End of no Due Letter Url 
// Api update tempUser Status to false 
export const updateUserId =  async (id : any ) => {
  const config = {
    method : "PATCH",
    maxBodyLength : Infinity ,
    url : `${API_URL}/tempUser?select=*&id=eq.${id}`,
    headers :  {
      'apikey': `${axios.defaults.headers.common['apikey']}`,
      'Authorization': `${axios.defaults.headers.common['Authorization']}`,
      'Content-Type': 'application/json'
    },
    data : { userId:true }
  };
  try {
  const res = await axios.request(config);
  console.log( `UserId updated to True: ${JSON.stringify(res.data)}`)
  return res.data
  }catch(e){
   if (axios.isAxiosError(e)){
    console.error("Axios Error in update userId : ", e.response?.data || e.message)
   }else{
    console.error("Error in updating userId to false " , e)
   }
  }
} 

// API to move a temp-user to the user table
export const movetempUserToUser = async (userdata : any ) => {
const config = {
  method : "POST" ,
  maxBodyLength : Infinity,
  url: `${API_URL}/user`,
    headers: {
      'apikey': `${axios.defaults.headers.common['apikey']}`,
      'Authorization': `${axios.defaults.headers.common['Authorization']}`,
      'Content-Type': 'application/json'
    },
  data : userdata //user data to be moved
};

try {
  const response = await axios.request(config);
  console.log(`User moved successfully : ${JSON.stringify(response.data)}`)
  await axiosSupaFuncInstance.get('/database-access')
  return response.data

}catch(e){
  if (axios.isAxiosError(e)) {
  console.error("Axios Error :", e.response?.data || e.message)
  }else{
    console.error("Error in Moving tempuser to uer", e)
  }

}
}

// Table to update resources from user table 
export const updateEmployeeData = async (t: temEmp): Promise<{status:number; message:string}> => {
  let data = JSON.stringify([
    {
      id : t.id,
      username : t.username,
      password : "Innovwayz@123",
      email : t.email,
      firstName : t.firstName,
      lastName : t.lastName,
      fullName : t.fullName,
      occupation : t.occupation,
      companyName : t.companyName,
      phone : t.phone,
      // roles : null,
      // pic : null,
      // language : t.language,
      // timeZone : 'AST',
      // website : null,
      // emailSettings : null,
      // auth : null,
      //  communication : null,
      address : t.address,
      socialNetworks : null,
      employeeJoiningDate : t.employeeJoiningDate,
      loginId : null,
      // employeeId : null,
      employeeBand : null,
      isClientFacing : true,
      client_id : t.client_id,
      isActive : true,
      contract_id : t.contract_id,
      associatedAccountManager : t.associatedAccountManager,

    }
  ]);
  console.log("APIData:" + data);
  let config = {
    method: 'PATCH',
    maxBodyLength: Infinity,
    url: `${API_URL}/user?id=eq.${t.id}`,
    headers: {
      'apikey': `${axios.defaults.headers.common['apikey']}`,
      'Authorization': `${axios.defaults.headers.common['Authorization']}`,
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
      console.error("error in tempEmp:",error.response?.data )
    }else{
      console.error("Unexpected error:",error);
    }

    return { status: 500, message: "Error creating Temperary Employee" };
  }
  
}

//End of table to update user from user table
// Table creation For temparary user 
export const createTempEmployee = async (t: temEmp): Promise<{status:number; message:string}> => {
  let data = JSON.stringify([
    {
      username : t.username,
      password : "Innovwayz@123",
      email : t.email,
      firstName : t.firstName,
      lastName : t.lastName,
      fullName : t.fullName,
      occupation : t.occupation,
      companyName : t.companyName,
      phone : t.phone,
      roles : null,
      pic : null,
      language : t.language,
      timeZone : 'AST',
      website : null,
      emailSettings : null,
      auth : null,
    //  communication : null,
      address : t.address,
      socialNetworks : null,
      loginId : null,
      employeeId : null,
      employeeBand : null,
      isClientFacing : true,
      client_id : t.client_id,
      isActive : true,
      contract_id : null,
      associatedAccountManager : t.associatedAccountManager,
      employeeJoiningDate : t.employeeJoiningDate,

    }
  ]);
  console.log("APIData:" + data);
  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: `${API_URL}/tempUser`,
    headers: {
      'apikey': `${axios.defaults.headers.common['apikey']}`,
      'Authorization': `${axios.defaults.headers.common['Authorization']}`,
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
      console.error("error in tempEmp:",error.response?.data  || error.message)
    }else{
      console.error("Unexpected error:",error);
    }

    return { status: 500, message: "Error creating Temperary Employee" };
  }
  
}

// table end for temp user

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
      associatedAccountManager: i.associatedAccountManager,
      invoice_paid_status: false,
      invoice_url: i.invoice_url,
      invoice_paid_date:null,
      invoice_paid_amount:null,
      invoicePeriod : iPayPrd,
    }
  ]);
  console.log("APIData:" + data);
  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: `${API_URL}/invoice`,
    headers: {
      'apikey': `${axios.defaults.headers.common['apikey']}`,
      'Authorization': `${axios.defaults.headers.common['Authorization']}`,
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
export const uploadInvoiceToSupabase = async (file: File): Promise<string | null> => {
  const filePath = `iwt_invoice_file/${setYear}/${update_date}/${file.name}`;

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

    // Step 3: Shorten the Signed URL
    const shortenResponse = await axios.get(
      `${CREATE_SHORT_URL}`,
      {
        params: { url: fullSignedUrl },
      }
    );

    if (
      shortenResponse.status === 200 &&
      shortenResponse.data?.secureShortURL
    ) {
      return shortenResponse.data.secureShortURL; //  This will go into invoice_url
    } else {
      throw new Error("Short URL generation failed");
    }
  } catch (error) {
    console.error('Error uploading, signing, or shortening invoice URL:', error);
    return null;
  }
};

// End of Invoice

// Start of Proposal
export const createProposal = async (p: Proposal): Promise<{status:number; message:string}> => {
  let data = JSON.stringify([
    {
      clientId: p.clientId,
      resourceName: p.resourceName,
      billingAnnually: p.billingAnnually,
      billingMonths: p.billingMonths,
      version: p.version,
      status: p.status,
      url: p.url,
      designation: p.designation
    }
  ]);
  console.log("APIData:" + data);
  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: `${API_URL}/proposals`,
    headers: {
      'apikey': `${axios.defaults.headers.common['apikey']}`,
      'Authorization': `${axios.defaults.headers.common['Authorization']}`,
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
export const uploadProposalToSupabase = async (file: File): Promise<string | null> => {
  const filePath = `iwt_proposals/${setYear}/${file.name}`;

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

    // Step 3: Shorten the Signed URL
    const shortenResponse = await axios.get(
      `${CREATE_SHORT_URL}`,
      {
        params: { url: fullSignedUrl },
      }
    );

    if (
      shortenResponse.status === 200 &&
      shortenResponse.data?.secureShortURL
    ) {
      return shortenResponse.data.secureShortURL; //  This will go into invoice_url
    } else {
      throw new Error("Short URL generation failed");
    }
  } catch (error) {
    console.error('Error uploading, signing, or shortening invoice URL:', error);
    return null;
  }
}; 
// End of Proposal 
// Start of PastEmployee table
export const createPastEmployee = async (i:PastUser): Promise<{status:number; message:string}> => {
  let data = JSON.stringify([
    {
              associatedUserId : i.associatedUserId,
              fullName : i.fullName,
              employeeJoiningDate : i.employeeJoiningDate,
              employeeExitDate : i.employeeExitDate,
              clearanceLetter : i.clearanceLetter,
              client_id : i.client_id,
              noDueLetter : i.noDueLetter,
              status : "OnNotice",
    }
  ]);
  console.log("APIData:" + data);
  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: `${API_URL}/pastEmployees`,
    headers: {
      'apikey': `${axios.defaults.headers.common['apikey']}`,
      'Authorization': `${axios.defaults.headers.common['Authorization']}`,
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
// End of PastEmployee table  
//Upload Cearance Letter 
export const uploadClearanceToSupabase = async (file: File): Promise<string | null> => {
  const filePath = `iwt_clearanceLetters/${setYear}/${file.name}`;

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

    // Step 3: Shorten the Signed URL
    const shortenResponse = await axios.get(
      `${CREATE_SHORT_URL}`,
      {
        params: { url: fullSignedUrl },
      }
    );

    if (
      shortenResponse.status === 200 &&
      shortenResponse.data?.secureShortURL
    ) {
      return shortenResponse.data.secureShortURL; //  This will go into invoice_url
    } else {
      throw new Error("Short URL generation failed");
    }
  } catch (error) {
    console.error('Error uploading, signing, or shortening invoice URL:', error);
    return null;
  }
}; 
//End of Upload Clearance Letter
// Start of no due letter
export const uploadNoDueToSupabase = async (file: File): Promise<string | null> => {
  const filePath = `iwt_clearanceLetters/${setYear}/${file.name}`;

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

    // Step 3: Shorten the Signed URL
    const shortenResponse = await axios.get(
      `${CREATE_SHORT_URL}`,
      {
        params: { url: fullSignedUrl },
      }
    );

    if (
      shortenResponse.status === 200 &&
      shortenResponse.data?.secureShortURL
    ) {
      return shortenResponse.data.secureShortURL; //  This will go into invoice_url
    } else {
      throw new Error("Short URL generation failed");
    }
  } catch (error) {
    console.error('Error uploading, signing, or shortening invoice URL:', error);
    return null;
  }
}; 
//End of No due 
// Start of Contract

export const createContractPage = async (c: ContractRequest): Promise<{status:number; message:string}> => {
  let data = JSON.stringify([
    {
      client_id: c.client_id,
      contract_no : c.contract_no,
      billing_value: c.billing_value,
      billing_start_date : null,
      billing_end_date : null,
      billing_months : c.billing_months,
      contract_date : c.contract_date,
      contract_end_date : c.contract_end_date,
      associatedAccountManager : c.associatedAccountManager,
      status:null,
      contract_file_location:null,
      associated_user_id:null,


    }
  ]);
  console.log("APIData:" + data);
  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: `${API_URL}/contract`,
    headers: {
      'apikey': `${axios.defaults.headers.common['apikey']}`,
      'Authorization': `${axios.defaults.headers.common['Authorization']}`,
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
    url : `${STORAGE_URL}/object/iwt_contracts/${setYear}/${file.name}` ,
    headers : {
      'Authorization' : `${axios.defaults.headers.common['Authorization']}`,
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
      const publicUrl = `${STORAGE_URL}/object/iwt_contracts/${setYear}/${fileKey}`;
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

const ENCORE_API = 'https://staging-iwtapiserver-6x92.encr.app';


// 🔥 This is your frontend function that will call your Encore backend API
export const createClaimPage = async (c: ClaimRequest): Promise<{status:number; message:string}> => {
  console.log("Sending ClaimRequest to Encore API:", c);

  try {
    const response = await axios.post(`${ENCORE_API}/sendExpense`, c, {
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

    return { status: 500, message: "Error Submitting Claim via Encore API" };
  }
};

export const uploadClaimsToSupabase = async (file: File): Promise<string | null> => {
  const filePath = `iwt_claims/${setYear}/${update_ClaimDate}/${file.name}`;

  const Cconfig = {
    method: "POST",
    maxBodyLength: Infinity,
    url: `${STORAGE_URL}/object/${filePath}`,
    headers: {
      'Authorization': `${axios.defaults.headers.common['Authorization']}`,
      'Content-Type': file.type,
    },
    data: file,
  };

  try {
    // Step 1: Upload
    const response = await axios(Cconfig);
    if (response.status !== 200) throw new Error("Upload failed");

    // Step 2: Generate signed URL
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

    if (signedUrlResponse.status !== 200 || !signedUrlResponse.data?.signedURL) {
      throw new Error("Failed to generate signed Url");
    }

    const fullSignedUrl = `${STORAGE_URL}${signedUrlResponse.data.signedURL}`;

    // Step 3: Shorten URL
    const shortenResponse = await axios.get(`${CREATE_SHORT_URL}`, {
      params: { url: fullSignedUrl },
    });

    if (shortenResponse.status === 200 && shortenResponse.data?.secureShortURL) {
      return shortenResponse.data.secureShortURL;
    } else {
      throw new Error("Failed generation of short url");
    }
  } catch (error) {
    console.error('Error in uploadClaimsToSupabase:', error);
    return null;
  }
};
/// End of claim
/// Update Claim start here 
export const updateExpense = async (expense: any): Promise<any> => {
  const data = JSON.stringify([{
    expenseDate: expense.expenseDate,
    expenseBy: expense.expenseBy,
    expenseAmount: expense.expenseAmount,
    expenseApprovedDate: expense.expenseApprovedDate,
    expenseApprovedAmount: expense.expenseApprovedAmount,
    externalTransactionId: expense.externalTransactionId,
    originalTransactionDate: expense.originalTransactionDate,
    externalTransactionNarration: expense.externalTransactionNarration,
    fileLocation: expense.fileLocation,
    isReconsile: expense.isReconsile
  }]);

  const config = {
    method: 'patch',
    maxBodyLength: Infinity,
    url: `${API_URL}/expenses?id=eq.${expense.id}`,
    headers: {
      'apikey': axios.defaults.headers.common['apikey'],
      'Content-Type': 'application/json',
      'Authorization': axios.defaults.headers.common['Authorization']
    },
    data
  };

  try {
    const response = await axios.request(config);
    return response.status === 204
      ? { status: 204, message: "Success" }
      : { status: response.status, message: "Failed" };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error updating expense:", error.response?.data || error.message);
    } else {
      console.error("Unexpected error:", error);
    }
    return { status: 500, message: "Failed to update expense" };
  }
};
/// End of update claims 

//  Start of Timesheet
export const uploadFileToSupabase = async (file:File): Promise< string | null> => {
    const filePath = `iwt_timesheets/${setYear}/${update_date}/${file.name}`;

  const TuploadConfig = {
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
    const uploadResponse = await axios(TuploadConfig);
    if (uploadResponse.status !== 200) throw new Error("Upload failed");

    // Step 2: Generate Signed URL (20 year)
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

    // Step 3: Shorten the Signed URL
    const shortenResponse = await axios.get(
      `${CREATE_SHORT_URL}`,
      {
        params: { url: fullSignedUrl },
      }
    );

    if (
      shortenResponse.status === 200 &&
      shortenResponse.data?.secureShortURL
    ) {
      return shortenResponse.data.secureShortURL; //  This will go into timesheetFileLocation
    } else {
      throw new Error("Short URL generation failed");
    }
  } catch (error) {
    console.error('Error uploading, signing, or shortening invoice URL:', error);
    return null;
  }
}


export const createEmployeeTimesheet = async (t: TimesheetRequest): Promise<{status:number; message:string}> => {
  const data = JSON.stringify([
    {
      employeeId: t.employeeId,
      employeeName: t.employeeName,
      associatedUserId : t.associatedUserId,
      employeeClient: t.employeeClient,
      timesheetMonthYear: t.timesheetMonthYear,
      workingDays:t.workingDays,
      holidayDays: t.holidayDays,
      holidayDates: t.holidayDates,
      leaveDays: t.leaveDays,
      leaveDates: t.leaveDates,
      approved:true,
      approvedBy:t.approvedBy,
      approvedDate:null,
      sentToFinance:false,
      timesheetFileLocation:t.timesheetFileLocation,
      createdBy: t.createdBy
    }
  ]);
  console.log("APIData:" + data);
  const config = {
    method: 'post',
    url: `${API_URL}/employeeTimesheet`,
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
