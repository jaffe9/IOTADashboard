import { string } from 'yup'
import { ID, Response } from '../../../../../../_metronic/helpers'

export enum payslipOptions { download = "download", email = "email" }

export type User = {
  associated_user_id?: number
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
associatedAccountManager?:number
id?:number
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
}

export type UsersQueryResponse = Response<Array<User>>

export type EmployeeOnboardingResponse = Response<Array<EmployeeOnboarding>>

export type TimesheetRequest = {
  timesheetFileLocation: any
  sentToFinance: any
  approvedDate: any
  approvedBy: any
  approved: any
  "workingDays": string,
  "employeeId": string,
  "employeeName": string,
  "employeeClient": string,
  "timesheetMonthYear": string,
  "holidayDays": string,
  "holidayDates": string,
  "leaveDays": string,
  "leaveDates": string,
  "createdBy": string,
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
   "invoice_url":string,
   "invoice_paid_date":string,
   "invoice_paid_amount":string,
}

export type ContractRequest = {
  "client_id" : string, 
  "contract_no": string,
  "associated_user_id" : number,
  "billing_value" : string,
  "billing_start_date" : string,
   "billing_end_date" : string,
   "billing_months" : number,
   "associatedAccountManager" : number,

}

export type ClaimRequest = {
  expenseTypeDesc: string
  associatedUserId: number
  "expenseType": number,
  "expenseDate": string,
  "expenseAmount": string,
  "expenseBy": string
}

export type temEmp = {
"username" : string,
"password" : string,
"email" : string,
"firstName" : string,
"lastName" : string,
"fullName" : string,
"occupation" : string,
"companyName" : string,
"phone" : string,
"language" : string,
"timeZone" : string,
"address" : string,
"clientId" : number,
"associated_account_manager" : number,
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

export const initialUser: User = {
  employeeId: 'avatars/300-6.jpg',
  occupation: 'Art Director',
  firstName: 'Jaffar',
  email: '',
  contract_id: '',
  associated_user_id: 0
}
