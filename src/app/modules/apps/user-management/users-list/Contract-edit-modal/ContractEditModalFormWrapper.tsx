/* eslint-disable @typescript-eslint/no-explicit-any */
import {useQuery} from 'react-query'
import {UserEditModalFormContract} from './ContractEditModalForm'
import { isNotEmpty, QUERIES} from '../../../../../../_metronic/helpers'
import {useListView} from '../core/ListViewProvider'
import {getUserById} from '../core/_requests'
import { apiHelper } from '../../../../../../apiFactory/apiHelper'
import { useEffect } from 'react'
import { Contract, payslipOptions} from '../core/_models'
import { cli } from 'webpack'
import { useContractListView } from '../core/ContractListViewProvider'
//
const getContractDataFromApi = async (id : string) => 
  {
    return await apiHelper.getContractForAction(id).then(function(result){return result})
  }
var contract_no = ""
var contract_date = ""
var contract_end_date = ""
var billing_months = 0
var billing_value = 0
var client_id = { client_name : "" }
var associatedAccountManager = { accountManagerName : "" }
var associated_user_id = { username : "" , email : ""}
var contract:Contract = {}
const UserEditModalFormWrapperContract = () => {
useEffect(() => 
    {
      let selected_User_id : any = "";
      selected_User_id = itemContractForUpdate?.toString()
      const contractInfo = getContractDataFromApi(selected_User_id)

      contractInfo.then(function(result : any)
      {
        contract = result
        contract_no = result.contract_no
        contract_date = result.contract_date
        contract_end_date = result.contract_end_date
        billing_months = result.billing_months
        billing_value = result.billing_value
        client_id.client_name = result.client_id.client_name
        associatedAccountManager.accountManagerName = result.associatedAccountManager.accountManagerName
        associated_user_id.username = result.associated_user_id.username 
        associated_user_id.email = result.associated_user_id.email

      })
    },[]
  )
  const {itemContractForUpdate, setItemContractForUpdate} = useContractListView()
  const enabledQuery: boolean = isNotEmpty(itemContractForUpdate)
  const {
    isLoading,
    data: user,
    error,
  } = useQuery(
    `${QUERIES.USERS_LIST}-user-${itemContractForUpdate}`,
    () => {
      return getUserById(itemContractForUpdate)
    },
    {
      cacheTime: 0,
      enabled: enabledQuery,
      onError: (err) => {
        setItemContractForUpdate(undefined)
        console.error(err)
      },
    },
  )
  
  if (!itemContractForUpdate) {
    return <UserEditModalFormContract isUserLoading={isLoading} user={{ id: undefined }} contract={contract}
    contract_no={contract_no} 
    contract_date={contract_date} 
    contract_end_date={contract_end_date}
    billing_months={billing_months}
    billing_value={billing_value}
    associatedAccountManager={associatedAccountManager}
    client_id={client_id}
    associated_user_id={associated_user_id}
    payslipOption={payslipOptions.download}
    payslipOptions={payslipOptions.email} />
  }

  if (!isLoading && !error && user) {
    return <UserEditModalFormContract isUserLoading={isLoading} user={user} contract={contract}
    contract_no={contract_no}
    contract_date={contract_date}
    contract_end_date={contract_end_date}
    billing_months={billing_months}
    billing_value={billing_value}
    associatedAccountManager={associatedAccountManager}
    associated_user_id={associated_user_id}
    client_id={client_id}
    payslipOption={payslipOptions.download}
    payslipOptions={payslipOptions.email} />
  }

  return null
}

export {UserEditModalFormWrapperContract}
