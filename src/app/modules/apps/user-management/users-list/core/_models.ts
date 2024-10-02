import { ID, Response } from '../../../../../../_metronic/helpers'

export enum payslipOptions { download = "download", email = "email" }

export type User = {
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
  status: number
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
  "createdBy": string
}

export const initialUser: User = {
  employeeId: 'avatars/300-6.jpg',
  occupation: 'Art Director',
  firstName: 'Jaffar',
  email: '',
}
