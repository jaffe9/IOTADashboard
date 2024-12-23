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
  language : string ;
  timeZone : string ;
  accountManager : number ;
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
}

export interface IProfileDetailsContract {
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
  language: "",
  timeZone: "",
  accountManager: 0,
  address: "",
  email: ""
};

export const profileDetailsInitValuesContract: IProfileDetailsContract = {
  associated_user_id: 0,
  username : "",
  contract_no : "",
  billing_value: "",
  billing_start_date : "",
  billing_end_date : "",
  billing_months : 0,
  associatedAccountManager : 0,
  status:null,
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
  // communications: {
  //   email: true,
  //   phone: true
  // },
  invoice_paid_date: "",
  invoice_paid_amount: "",
  associated_user_id: "",
};
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
