import axios, { AxiosResponse } from "axios";
import { ID, Response } from "../../../../../../_metronic/helpers";
import { User, UsersQueryResponse } from "./_models";

//Set Axios Default
axios.defaults.headers.common['Authorization'] = `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpocGxrdGFvdnB5ZW5teXBranFsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY5MjUxOTYzMywiZXhwIjoyMDA4MDk1NjMzfQ.i-QsgcR7aZTxpubO0dHGPs-li50B7GrVQKsuW866YLA`;
axios.defaults.headers.common['apikey'] = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpocGxrdGFvdnB5ZW5teXBranFsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY5MjUxOTYzMywiZXhwIjoyMDA4MDk1NjMzfQ.i-QsgcR7aZTxpubO0dHGPs-li50B7GrVQKsuW866YLA`;


//const API_URL = import.meta.env.VITE_APP_THEME_API_URL;
const API_URL = `https://zhplktaovpyenmypkjql.supabase.co/rest/v1`;
const USER_URL = `${API_URL}/user`;
const GET_USERS_URL = `${API_URL}/user`;

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

export {
  getUsers,
  deleteUser,
  deleteSelectedUsers,
  getUserById,
  createUser,
  updateUser,
};
