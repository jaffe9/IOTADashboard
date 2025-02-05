import axios, { AxiosResponse } from "axios";
import { ID, Response } from "../../../../../../_metronic/helpers";
import { Contract, National_id, User, UsersQueryResponse } from "./_models";

//Set Axios Default
axios.defaults.headers.common['Authorization'] = `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpocGxrdGFvdnB5ZW5teXBranFsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY5MjUxOTYzMywiZXhwIjoyMDA4MDk1NjMzfQ.i-QsgcR7aZTxpubO0dHGPs-li50B7GrVQKsuW866YLA`;
axios.defaults.headers.common['apikey'] = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpocGxrdGFvdnB5ZW5teXBranFsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY5MjUxOTYzMywiZXhwIjoyMDA4MDk1NjMzfQ.i-QsgcR7aZTxpubO0dHGPs-li50B7GrVQKsuW866YLA`;


//const API_URL = import.meta.env.VITE_APP_THEME_API_URL;
const API_URL = `https://zhplktaovpyenmypkjql.supabase.co/rest/v1`;
const USER_URL = `${API_URL}/user`;
const GET_USERS_URL = `${API_URL}/user`;
const GET_IQAMA_DETAILS_URL = `${API_URL}/nationalIdInfo`;
const GET_CONTRACT_DETAILS_URL = `${API_URL}/contract`

const getUsers = async (query: string): Promise<UsersQueryResponse> => {
  const d = await axios
    .get(`${GET_USERS_URL}?select=id,username,email,firstName,lastName,occupation,companyName,phone,employeeJoiningDate,employeeId&isClientFacing=eq.1&order=id`);
  return d;
};

const getUserById = async (id: ID): Promise<User | undefined> => {
  const response = await axios
    .get(`${GET_USERS_URL}?select=username,email,firstName,lastName,occupation,timeZone,phone,employeeJoiningDate,pic&id=eq.${id}`);
  return response.data;
};

const createUser = (user: User): Promise<User | undefined> => {
  return axios
    .put(USER_URL, user)
    .then((response: AxiosResponse<Response<User>>) => response.data)
    .then((response: Response<User>) => response.data);
};

const updateUser = (user: User): Promise<User | undefined> => {
  return axios
    .post(`${USER_URL}/${user.id}`, user)
    .then((response: AxiosResponse<Response<User>>) => response.data)
    .then((response: Response<User>) => response.data);
};

const deleteUser = (userId: ID): Promise<void> => {
  return axios.delete(`${USER_URL}/${userId}`).then(() => {});
};

const deleteSelectedUsers = (userIds: Array<ID>): Promise<void> => {
  const requests = userIds.map((id) => axios.delete(`${USER_URL}/${id}`));
  return axios.all(requests).then(() => {});
};

// Start Of Iqama Update //
const UpdateIqamaExp = async(iq:National_id) : Promise<any> => {
  let data = JSON.stringify([
    {
      expiry_date: iq.expiry_date
    }
  ]);
  
  let config = {
    method: 'patch',
    maxBodyLength: Infinity,
    url: `https://zhplktaovpyenmypkjql.supabase.co/rest/v1/nationalIdInfo?id=eq.${iq.id}`,
    headers: { 
      'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpocGxrdGFvdnB5ZW5teXBranFsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY5MjUxOTYzMywiZXhwIjoyMDA4MDk1NjMzfQ.i-QsgcR7aZTxpubO0dHGPs-li50B7GrVQKsuW866YLA', 
      'Content-Type': 'application/json', 
      'Authorization': 'Bearer  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpocGxrdGFvdnB5ZW5teXBranFsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY5MjUxOTYzMywiZXhwIjoyMDA4MDk1NjMzfQ.i-QsgcR7aZTxpubO0dHGPs-li50B7GrVQKsuW866YLA'
    },
    data : data
  };
  
  try{
    console.log(data);
    console.log(config.url);
   const response = await axios.request(config);
  
   if (response.status === 204){
    return { status : response.status, message: "success" };
   }else{
     return {status:response.status, message: "Failed "}
   }
  }catch(error){
    if (axios.isAxiosError(error)){
      console.error("error in update Iqama Exp:", error.response?.data || error.message)
    }else{
      console.log("Unexpected Error in update Iqama Expiry :" , error)
    }
  return { status : 500 , message : "Error updating Iqama Expiry "}
  }
  }
 const getEmpForIqamaInForm = async () : Promise<UsersQueryResponse> => {
    const d = await axios
    .get(`${GET_IQAMA_DETAILS_URL}?select=id,national_id,expiry_date,associated_user_id(username,email)&order=id`);
    return d;
  }
// End Of Iqama Update //

// Contract update start here
const UpdateContractExp = async(c:Contract) : Promise<any> => {
  let data = JSON.stringify([
    {
      contract_no : c.contract_no,
      contract_date: c.contract_date,
      contract_end_date : c.contract_end_date,
    }
  ]);
  
  let config = {
    method: 'patch',
    maxBodyLength: Infinity,
    url: `https://zhplktaovpyenmypkjql.supabase.co/rest/v1/contract?id=eq.${c.id}`,
    headers: { 
      'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpocGxrdGFvdnB5ZW5teXBranFsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY5MjUxOTYzMywiZXhwIjoyMDA4MDk1NjMzfQ.i-QsgcR7aZTxpubO0dHGPs-li50B7GrVQKsuW866YLA', 
      'Content-Type': 'application/json', 
      'Authorization': 'Bearer  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpocGxrdGFvdnB5ZW5teXBranFsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY5MjUxOTYzMywiZXhwIjoyMDA4MDk1NjMzfQ.i-QsgcR7aZTxpubO0dHGPs-li50B7GrVQKsuW866YLA'
    },
    data : data
  };
  
  try{
    console.log(data);
    console.log(config.url);
   const response = await axios.request(config);
  
   if (response.status === 204){
    return { status : response.status, message: "success" };
   }else{
     return {status:response.status, message: "Failed "}
   }
  }catch(error){
    if (axios.isAxiosError(error)){
      console.error("error in update Contract Exp:", error.response?.data || error.message)
    }else{
      console.log("Unexpected Error in update Contract Expiry :" , error)
    }
  return { status : 500 , message : "Error updating Contract Expiry "}
  }
  }
 const getEmpForContractInForm = async () : Promise<UsersQueryResponse> => {
    const d = await axios
    .get(`${GET_CONTRACT_DETAILS_URL}?select=id,client_id(client_name),contract_no,billing_start_date,billing_end_date,billing_months,associatedAccountManager(accountManagerName),contract_date,contract_end_date,billing_value,associated_user_id(username,email)&order=id`);
    return d;
  }
// End of contract Update
export {
  getUsers,
  deleteUser,
  deleteSelectedUsers,
  getUserById,
  createUser,
  updateUser,
  UpdateIqamaExp,
  getEmpForIqamaInForm,
  getEmpForContractInForm,
  UpdateContractExp,
};
