import axios, { AxiosResponse } from "axios";
import { AuthModel, UserModel } from "./_models";
//import { User } from "../../apps/user-management/users-list/core/_models";
console.log("2")
const API_URL = import.meta.env.VITE_APP_API_URL;

//export const GET_USER_BY_ACCESSTOKEN_URL = `${API_URL}/verify_token`;
export const GET_USER_BY_ACCESSTOKEN_URL = `https://zhplktaovpyenmypkjql.supabase.co/rest/v1/user`;
//export const LOGIN_URL = `${API_URL}/login`;
export const LOGIN_URL = `https://zhplktaovpyenmypkjql.supabase.co/auth/v1/token?grant_type=password`;
export const REGISTER_URL = `${API_URL}/register`;
export const REQUEST_PASSWORD_URL = `${API_URL}/forgot_password`;

//Set Axios Default
axios.defaults.headers.common['Authorization'] = `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpocGxrdGFvdnB5ZW5teXBranFsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY5MjUxOTYzMywiZXhwIjoyMDA4MDk1NjMzfQ.i-QsgcR7aZTxpubO0dHGPs-li50B7GrVQKsuW866YLA`;
axios.defaults.headers.common['apikey'] = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpocGxrdGFvdnB5ZW5teXBranFsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY5MjUxOTYzMywiZXhwIjoyMDA4MDk1NjMzfQ.i-QsgcR7aZTxpubO0dHGPs-li50B7GrVQKsuW866YLA`;

// Server should return AuthModel
export function login(email: string, password: string) {
  return axios.post<AuthModel>(LOGIN_URL, {
    "email": email,
    "password": password
  });
}

// Server should return AuthModel
export function register(
  email: string,
  firstname: string,
  lastname: string,
  password: string,
  password_confirmation: string
) {
  return axios.post(REGISTER_URL, {
    email,
    first_name: firstname,
    last_name: lastname,
    password,
    password_confirmation,
  });
}

// Server should return object => { result: boolean } (Is Email in DB)
export function requestPassword(email: string) {
  return axios.post<{ result: boolean }>(REQUEST_PASSWORD_URL, {
    email,
  });
}

export async function getUserByToken(token: string) {
  return await axios.get<UserModel>(`${GET_USER_BY_ACCESSTOKEN_URL}?loginId=eq.${token}&select=*`);
}

const getUsersByLoginId = (login_id: string): Promise<UserModel> => {
   return axios
    .get(`${GET_USER_BY_ACCESSTOKEN_URL}?loginId=eq.${login_id}&select=*`)
    .then((d: AxiosResponse<UserModel>) => d.data);
};

export {getUsersByLoginId};
