import { ID, Response } from '../../../../../../_metronic/helpers'

export enum payslipOptions { download = "download", email = "email" }

export type User = {
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
  contract_id: ''
}
