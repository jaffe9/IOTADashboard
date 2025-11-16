import { string } from 'yup'
import { ID, Response } from '../../../../../../_metronic/helpers'
import { StickyComponent } from '../../../../../../_metronic/assets/ts/components'
import { StepTypeMap } from '@mui/material'

export enum payslipOptions { download = "download", email = "email" }

export type User = {
  associated_user_id?: any
  contract_id?: string
  id?: number
  username?: string
  email?: string
  firstName?: string
  lastName?: string
  occupation?: string
  companyName?: string
  phone?: string
  employeeJoiningDate?: string
  employeeId?: string
  pic?: string
  associatedAccountManage?:number
  fullName?:string
  language?:string[]

}

export type PastUser = {
    associatedUserId?:number;
    fullName?:string;
    employeeJoiningDate? : string;
    employeeExitDate?: any;
    clearanceLetter ?: any
    client_id ?:number;
    noDueLetter ?:any
}

export type TempUser = {
  associated_user_id?: number
  client_id?: number
  id?: number
  username?: string
  email?: string
  firstName?: string
  lastName?: string
  occupation?: string
  companyName?: string
  phone?: string
  employeeJoiningDate?: string
  employeeId?: string
  pic?: string
}

export type clients = {
  id? : number,
  client_name? : string,
}

export type Expenses = {
  id?: number
  expenseTypeDesc?: string
  expenseBy?: string
  expenseType?: number
}

export type Contract = {
id?:number
contract_no?:string
contract_date?:string
contract_end_date?:string
billing_start_date?:string
billing_end_date?:string
billing_months?:number
billing_value?:string
client_id?:{ client_name : string }
associatedAccountManager?: number
accountManagerName ?: string 
associated_user_id?: { username : string , email : string }
}

export type ResourceOnboardingStatus = {
  id: number;
  created_at: Date;
  status_progress: number;
  status_description: string;
}

export type EmployeeOnboarding = {
  id: number;
  created_at: Date;
  resource_name: string;
  resource_end_client: number;
  resource_onboarding_status: number;
  resourceOnboardingStatus: ResourceOnboardingStatus;
}

export type Salary = {
  id?: number
  pay_period?: string
  pay_date?:string
  basic_allowance?: string
  hr_allowance?: string
  end_of_service_allowance?: string
  travel_other_allowance?: string
  earnings_total?: string
  lop_days?: string
  employee_request?: string
  salary_advance?: string
  lop_salary_total?: string
  total_net_salary?: string
  total_net_salary_words?: string
  salary_pay_mode?: string
  working_days?: string
  holidays?: string
  deductions_total?: string
  payslilpOptionSelected?: payslipOptions
  user_id?: { 
    username?: string 
    email?: string
  }
  leaves?: string
  overTime?:string
}
export type AddTypeSalary = {
  id?: number
  pay_period?: string
  pay_date?:string
  basic_allowance?: string
  hr_allowance?: string
  end_of_service_allowance?: string
  travel_other_allowance?: string
  earnings_total?: string
  lop_days?: string
  employee_request?: string
  salary_advance?: string
  lop_salary_total?: string
  total_net_salary?: string
  total_net_salary_words?: string
  salary_pay_mode?: string
  working_days?: string
  holidays?: string
  deductions_total?: string
  payslilpOptionSelected?: payslipOptions
  user_id?: string
  username : string
  overTime? : string
  leaves?: string
}

export type National_id = {
  id?:number
  national_id?: string
  expiry_date?: string
  associated_user_id?:{
    username : string
    email : string
    id : number
  }
}


export type UsersQueryResponse = Response<Array<User>>

export type EmployeeOnboardingResponse = Response<Array<EmployeeOnboarding>>

export type TimesheetRequest = {
  "timesheetFileLocation": string | null,
  sentToFinance: any
  approvedDate: any
  approvedBy: string
  approved: any
  associatedUserId:number,
  "workingDays": string,
  "employeeId": string,
  "employeeName": string,
  "employeeClient": string,
  "timesheetMonthYear": string,
  "holidayDays": string,
  "holidayDates": string,
  "leaveDays": string,
  "leaveDates": string,
  "createdBy": number,
  "status": number
}

export type InvoiceRequest = {
   associated_user_id: any
   status: number
   "contract_id":string,
   "client_id":string,
   "internal_invoice_no":string,
   "external_invoice_no":string,
   "invoice_date":string,
   "invoice_value":string,
   "invoice_paid_status":boolean,
   "invoice_url":string | null,
   "invoice_paid_date":string,
   "invoice_paid_amount":string,
   "associatedAccountManager":number,
}

export type ContractRequest = {
  "client_id" : string, 
  "contract_no": string,
  "associated_user_id" : number,
  "billing_value" : string,
  "billing_start_date" : string,
   "billing_end_date" : string,
   "contract_date" : string,
   "contract_end_date" : string;
   "billing_months" : number,
   "associatedAccountManager" : number,
   "contract_file_location" : any

}

export type ClaimRequest = {
  expenseTypeDesc: string
  associatedUserId: number
  "expenseType": number,
  "expenseDate": string,
  "expenseAmount": string,
  "expenseBy": string,
  fileLocation : any
}

  export type Expense = {
  id: number;
  expenseType: {
    expenseTypeDesc : string
  };
  expenseDate: string;
  expenseBy: string;
  expenseAmount: number;
  expenseApprovalStatus: boolean;
  expenseApprovedBy: {
    accountManagerName:string
  };
  expenseApprovedDate: string;
  expenseApprovedAmount: number;
  externalTransactionId: string;
  originalTransactionDate: string;
  externalTransactionNarration: string;
  associatedUserId: {
     fullName : string
  };
  fileLocation: string;
  isReconsile: boolean;
}

export type temEmp = {
"id" : number,
"username" : string,
"password" : string,
"email" : string,
"firstName" : string,
"lastName" : string,
"fullName" : string,
"occupation" : string,
"companyName" : string,
"phone" : string,
"language" : string[],
"timeZone" : string,
"address" : string,
"client_id" : number,
"associatedAccountManager" : number,
"contract_id": string,
employeeJoiningDate : string,
pic : any
}

export type ListOfTimesheet = {
  length: number,
  status: number,
  "createdAt": string,
  "employeeId": string,
  "employeeName": string,
  "employeeClient": string,
  "timesheetMonthYear": string,
  "workingDays": string,
  "workingDates": string,
  "holidayDays": string,
  "holidayDates": string,
  "leaveDays": string,
  "leaveDates": string,
  "createdBy": string,
  "approved": boolean,
  "approvedDate": Date,
  "sentToFinance": boolean,
  "timesheetFileLocation": string
}

export type Proposal = {
  id: number;
  clientId: number;
  resourceName: string;
  billingAnnually: number;
  billingMonths: string;
  version: number;
  status: string;
  url: any;
  designation: string;
}

export type Payslips = {
  associatedUserId : number,
  paySlipLink : string ,
  fullName : string,
  monthYear : string
}
export const initialUser: User = {
  employeeId: 'avatars/300-6.jpg',
  occupation: 'Art Director',
  firstName: '',
  lastName:'',
  email: '',
  contract_id: '',
  associated_user_id: {username:'' , email : ''}
}
