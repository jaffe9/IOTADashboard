/* eslint-disable @typescript-eslint/no-explicit-any */
import {useQuery} from 'react-query'
import {UserEditModalFormContract} from './ContractEditModalForm'
import { isNotEmpty, QUERIES} from '../../../../../../_metronic/helpers'
import {useListView} from '../core/ListViewProvider'
import {getUserById} from '../core/_requests'
import { apiHelper } from '../../../../../../apiFactory/apiHelper'
import { useEffect } from 'react'
import { Contract, payslipOptions} from '../core/_models'
//
const getContractDataFromApi = async (id : string) => 
  {
    return await apiHelper.getContractExpiries().then(function(result){return result})
  }
let contract_no = ""
let contract_date = ""
let contract_end_date = ""
// eslint-disable-next-line @typescript-eslint/no-unused-vars
let contract:Contract
const UserEditModalFormWrapperContract = () => {
useEffect(() => 
    {
      let selected_User_id : any = "";
      selected_User_id = itemIdForUpdate?.toString()
      const iqamaInfo = getContractDataFromApi(selected_User_id)

      iqamaInfo.then(function(result : any)
      {
        contract = result
        contract_no = result.contract_no
        contract_date = result.contract_date
        contract_end_date = result.contract_end_date

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
    return <UserEditModalFormContract isUserLoading={isLoading} user={{ id: undefined }} contract_no={contract_no} contract_date={contract_date} contract_end_date = {contract_end_date}

    payslipOption={payslipOptions.download}
    payslipOptions={payslipOptions.email} />
  }

  if (!isLoading && !error && user) {
    return <UserEditModalFormContract isUserLoading={isLoading} user={user}  contract_no={contract_no}  contract_date={contract_date} contract_end_date={contract_end_date}

    payslipOption={payslipOptions.download}
    payslipOptions={payslipOptions.email} />
  }

  return null
}

export {UserEditModalFormWrapperContract}
