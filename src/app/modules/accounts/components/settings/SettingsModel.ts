export interface IProfileDetails {
  sEmployee: string;
  fName: string;
  client: string;
  monthyear: string;
  dates: string;
  datesStr: string;
  leaves: string;
  leavesStr: string;
  holidays: string;
  holidaysStr: string;
  communications:
  {
    email: boolean;
    phone: boolean;
  }
  loadDefault: boolean;
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
  monthyear: "",
  holidays: "0",
  holidaysStr: "",
  leaves: "0",
  leavesStr: "",
  dates:"",
  datesStr:"",
  communications:{
    email:true,
    phone: true
  },
  loadDefault: true
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
