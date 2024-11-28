import {useQuery} from 'react-query'
import {UserEditModalForm} from './UserEditModalForm'
import {isNotEmpty, QUERIES} from '../../../../../../_metronic/helpers'
import {useListView} from '../core/ListViewProvider'
import {getUserById} from '../core/_requests'
import { apiHelper } from '../../../../../../apiFactory/apiHelper'
import { useEffect } from 'react'
import { payslipOptions, Salary } from '../core/_models'
import { string } from 'yup'

const getSalaryDataFromApi = async (id : string) => 
  {
    return await apiHelper.getSalaryInfoByEmployee(id).then(function(result){return result})
  }
var basic_allowance = 0
var hr_allowance = 0
var travel_allowance = 0
var lop_days = 0
var salary_advance = 0
var employee_request = 0
var lop_salary_total = 0
var earnings_total = 0
var deductions_total = 0
var total_net_salary = 0
var holidays = 0
var salary:Salary = {}
const UserEditModalFormWrapper = () => {
useEffect(() => 
    {
      var selected_User_id : any = "";
      selected_User_id = itemIdForUpdate?.toString()
      const salaryInfo = getSalaryDataFromApi(selected_User_id)

      salaryInfo.then(function(result : any)
      {
        salary = result
        basic_allowance = result.basic_allowance
        hr_allowance = result.hr_allowance
        travel_allowance = result.travel_other_allowance
        lop_days = result.lop_days
        salary_advance = result.salary_advance
        employee_request = result.employee_request
        holidays = result.holidays
        lop_salary_total = result.lop_salary_total
        earnings_total = result.earnings_total
        deductions_total = result.deductions_total
        total_net_salary = result.total_net_salary
      })
    },[]
  )
  const {itemIdForUpdate, setItemIdForUpdate} = useListView()
  const enabledQuery: boolean = isNotEmpty(itemIdForUpdate)
  const {
    isLoading,
    data: user,
    error,
  } = useQuery(
    `${QUERIES.USERS_LIST}-user-${itemIdForUpdate}`,
    () => {
      return getUserById(itemIdForUpdate)
    },
    {
      cacheTime: 0,
      enabled: enabledQuery,
      onError: (err) => {
        setItemIdForUpdate(undefined)
        console.error(err)
      },
    },
  )
  
  if (!itemIdForUpdate) {
    return <UserEditModalForm isUserLoading={isLoading} user={{ id: undefined }} salary={salary} basic_allowance={basic_allowance} hr_allowance={hr_allowance} travel_allowance={travel_allowance} lop_days={lop_days}
    salary_advance={salary_advance}
    employee_request={employee_request}
    holidays={holidays}
    lop_salary_total={lop_salary_total}
    earnings_total={earnings_total}
    deductions_total={deductions_total}
    total_net_salary={total_net_salary} 
    payslipOption={payslipOptions.download}
    payslipOptions={payslipOptions.email}/>
  }

  if (!isLoading && !error && user) {
    return <UserEditModalForm isUserLoading={isLoading} user={user} salary={salary} basic_allowance={basic_allowance} hr_allowance={hr_allowance} travel_allowance={travel_allowance} lop_days={lop_days} salary_advance={salary_advance}
    employee_request={employee_request}
    holidays={holidays}
    lop_salary_total={lop_salary_total}
    earnings_total={earnings_total}
    deductions_total={deductions_total}
    total_net_salary={total_net_salary} 
    payslipOption={payslipOptions.download} 
    payslipOptions={payslipOptions.email}/>
  }

  return null
}

export {UserEditModalFormWrapper}
