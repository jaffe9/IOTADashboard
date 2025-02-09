import { StickyComponent } from "../../../../../_metronic/assets/ts/components";

export interface IProfileDetails {
  associatedUserId: number;
  password : string ;
  expenseTypeDesc:string
  expenseType: number;
  expenseDate: string;
  expenseBy: string;
  expenseAmount: string;
  invoice_url:string,
  invoice_date:string,
  internal_invoice_no:string,
  external_invoice_no:string,
  invoice_value:string,
  client_id: any;
  workingDays: any;
  contract_id:string;
  sEmployee: string;
  fName: string;
  uName:string;
  lName : string ;
  fullName : string ;
  occupation : string ;
  companyName : string ;
  phone : string ;
  language : string[] ;
  timeZone : string ;
  associated_account_manager : number ;
  address : string ;
  client: string;
  monthyear: string;
  dates: string;
  datesStr: string;
  leaves: string;
  leavesStr: string;
  holidays: string;
  holidaysStr: string;
  invoice_paid_status:boolean;
  email : string ;
  communications:
  {
    email: boolean;
    phone: boolean;
  }
  loadDefault: boolean;
  associatedAccountManager : number;
}

export interface IProfileDetailsInvoice {
  associated_user_id: any;
  invoice_paid_amount: string;
  invoice_url:string,
  invoice_date:string,
  internal_invoice_no:string,
  external_invoice_no:string,
  invoice_value:string,
  client_id: any;
  contract_id:string;
  invoice_paid_date:string;
  invoice_paid_status:boolean,
  associatedAccountManager:number,
}

export interface IProfileDetailsContract {
  id : number
  contract_end_date: string;
  contract_date: string;
  associated_user_id: any;
  contract_no : string,
  billing_value: string,
  billing_start_date : string,
  billing_end_date : string,
  billing_months : number,
  associatedAccountManager : number,
  status:null,
  contract_file_location:null,
  client_id: any;
  username : string

}

export interface IProfileDetailsContractForAction {
  id : number
  contract_end_date: string;
  contract_date: string;
  associated_user_id: {
    username:string,
    email:string,
  };
  contract_no : string,
  billing_value: string,
  billing_start_date : string,
  billing_end_date : string,
  billing_months : number,
  associatedAccountManager : number,
  status:null,
  contract_file_location:null,
  client_id: any;
  username : string

}
export type IProfileDetailsNationalId = {
  id?:number
  national_id?: string
  expiry_date?: string
  associated_user_id?:{
    username : string
    email : string
    id : number
  } 
}

export type IProfileDetailsSalary = {
  pay_date?: string;
  id?: number
  pay_period: string
  basic_allowance: string
  hr_allowance: string
  end_of_service_allowance: string
  travel_other_allowance: string
  earnings_total: string
  lop_days: string
  employee_request: string
  salary_advance: string
  lop_salary_total: string
  total_net_salary: string
  total_net_salary_words: string
  salary_pay_mode: string
  working_days: string
  holidays: string
  deductions_total: string
  user_id:{
    username : String 
    email : string
  }
}


export interface IUpdateEmail {
  newEmail: string;
  confirmPassword: string;
}

export interface IUpdatePassword {
  currentPassword: string;
  newPassword: string;
  passwordConfirmation: string;
}

export interface IConnectedAccounts {
  google: boolean;
  github: boolean;
  stack: boolean;
}

export interface IEmailPreferences {
  successfulPayments: boolean;
  payouts: boolean;
  freeCollections: boolean;
  customerPaymentDispute: boolean;
  refundAlert: boolean;
  invoicePayments: boolean;
  webhookAPIEndpoints: boolean;
}

export interface INotifications {
  notifications: {
    email: boolean;
    phone: boolean;
  };
  billingUpdates: {
    email: boolean;
    phone: boolean;
  };
  newTeamMembers: {
    email: boolean;
    phone: boolean;
  };
  completeProjects: {
    email: boolean;
    phone: boolean;
  };
  newsletters: {
    email: boolean;
    phone: boolean;
  };
}

export interface IDeactivateAccount {
  confirm: boolean;
}

var monthNames = ['January', 'February', 'March', 
               'April', 'May', 'June', 'July', 
               'August', 'September', 'October', 'November', 'December'];

var date = new Date();
var month = monthNames[date.getMonth()]; 
var year = date.getFullYear();

export const profileDetailsInitValues: IProfileDetails = {
  sEmployee: "",
  fName: "",
  client: "",
  workingDays: "",
  monthyear: "",
  holidays: "0",
  holidaysStr: "",
  leaves: "0",
  leavesStr: "",
  dates: "",
  datesStr: "",
  communications: {
    email: true,
    phone: true
  },
  loadDefault: true,
  invoice_paid_status: false,
  client_id: "",
  contract_id: "",
  internal_invoice_no: "",
  external_invoice_no: "",
  invoice_value: "",
  invoice_url: "",
  invoice_date: "",
  expenseType: 0,
  expenseDate: "",
  expenseBy: "",
  expenseAmount: "",
  associatedUserId: 0,
  expenseTypeDesc: "",
  password: "",
  uName: "",
  lName: "",
  fullName: "",
  occupation: "",
  companyName: "",
  phone: "",
  language: [],
  timeZone: "",
  associated_account_manager: 0,
  address: "",
  email: "",
  associatedAccountManager:0,
};

export const profileDetailsInitValuesContract: IProfileDetailsContract = {
  associated_user_id: 0,
  id : 0,
  username : "",
  contract_no : "",
  billing_value: "",
  billing_start_date : "",
  billing_end_date : "",
  billing_months : 0,
  associatedAccountManager : 0,
  status:null,
  contract_date :"",
  contract_end_date : "",
  contract_file_location:null,
  client_id: 0,
}

export const profileDetailsInitValuesContractForAction: IProfileDetailsContractForAction = {
  associated_user_id: {
    username:'',
    email:'',
  },
  id : 0,
  username : "",
  contract_no : "",
  billing_value: "",
  billing_start_date : "",
  billing_end_date : "",
  billing_months : 0,
  associatedAccountManager : 0,
  status:null,
  contract_date :"",
  contract_end_date : "",
  contract_file_location:null,
  client_id: 0,
}

export const profileDetailsInitValuesInvoice: IProfileDetailsInvoice = {
  invoice_paid_status: false,
  client_id: "",
  contract_id: "",
  internal_invoice_no: "",
  external_invoice_no: "",
  invoice_value: "",
  invoice_url: "",
  invoice_date: "",
  associatedAccountManager:0,
  // communications: {
  //   email: true,
  //   phone: true
  // },
  invoice_paid_date: "",
  invoice_paid_amount: "",
  associated_user_id: "",
};

export const  profileDetailsSalaryInitialValues: IProfileDetailsSalary = {
  id: 0,
  pay_period: "",
  pay_date:"",
  basic_allowance:"", 
  hr_allowance: "",
  end_of_service_allowance: "",
  travel_other_allowance:"",
  earnings_total: "",
  lop_days: "",
  employee_request: "",
  salary_advance: "",
  lop_salary_total:"",
  total_net_salary: "",
  total_net_salary_words: "",
  salary_pay_mode: "",
  working_days: "",
  holidays: "",
  deductions_total: "",
  user_id:{
    username : "",
    email : ""
  },
}

export const profileDetailsInitValuesNationalId : IProfileDetailsNationalId = {
  id:0,
  national_id:"",
  expiry_date:"",
  associated_user_id:{
    username:"",
    id:0,
    email:"",
  }
}

export const updateEmail: IUpdateEmail = {
  newEmail: "support@keenthemes.com",
  confirmPassword: "",
};

export const updatePassword: IUpdatePassword = {
  currentPassword: "",
  newPassword: "",
  passwordConfirmation: "",
};

export const connectedAccounts: IConnectedAccounts = {
  google: true,
  github: true,
  stack: false,
};

export const emailPreferences: IEmailPreferences = {
  successfulPayments: false,
  payouts: true,
  freeCollections: false,
  customerPaymentDispute: true,
  refundAlert: false,
  invoicePayments: true,
  webhookAPIEndpoints: false,
};

export const notifications: INotifications = {
  notifications: {
    email: true,
    phone: true,
  },
  billingUpdates: {
    email: true,
    phone: true,
  },
  newTeamMembers: {
    email: true,
    phone: false,
  },
  completeProjects: {
    email: false,
    phone: true,
  },
  newsletters: {
    email: false,
    phone: false,
  },
};

export const deactivateAccount: IDeactivateAccount = {
  confirm: false,
};
