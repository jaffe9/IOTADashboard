
// Setting the valuees  
export const setAccountManagerId = (id: string) => {
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