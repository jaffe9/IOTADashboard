import axios from "axios";
import { getAccountManager } from "../../../../apiFactory/apiHelper";

// Setting the valuees  
export const setAccountManagerId = (id: string ) => {
    //accountManagerId = id
    localStorage.setItem('accountManagerId', id);
};
export const setLoggedUser = (login_id:string) => {
   //  loggedUser = login_id
   localStorage.setItem('loggedUser', login_id);
 
}
export const setUserId = (id:string) =>{
  localStorage.setItem('id',id)

}


// getting the values 
export const getAccountManagerId = () => {
    return localStorage.getItem('accountManagerId')
};
export const getLoggedUser = () => {
    return localStorage.getItem('loggedUser');
}
export const getUserId = () => {
    return  localStorage.getItem('id')
}

// passing these values to the backend Server 


    export const userIdToEncore = async () => {
        const loggedUser = getLoggedUser();
        const getAccountManager = getAccountManagerId();
        const getId =  getUserId();
        console.log(loggedUser,getAccountManager,getId);
        const data = JSON.stringify({
            loggedUser: loggedUser,
            accountManagerId: getAccountManager,
            id: getId,
        });
          
        const config = {
            method: 'PATCH',
            maxBodyLength: Infinity,
            url: "https://staging-iwtapiserver-6x92.encr.app/userCount",
            headers: { 
              'Content-Type': 'application/json'
            },
            data: data,
            withCredentials: true , 
        };
          
        try {
            const response = await axios.request(config);
            console.log("User count response:", JSON.stringify(response.data));
            return response.data
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error("Axios Error in posting loggedUser to backend:", error.response?.data || error.message);
            } else {
                console.error("Error in posting loggedUser to backend:", error);
            }
        }
    }