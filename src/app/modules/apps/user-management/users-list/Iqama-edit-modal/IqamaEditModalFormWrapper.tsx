/* eslint-disable @typescript-eslint/no-explicit-any */
import {useQuery} from 'react-query'
import {UserEditModalFormIqama} from './IqamaEditModalForm'
import {isNotEmpty, QUERIES} from '../../../../../../_metronic/helpers'
import {getUserById} from '../core/_requests'
import { apiHelper} from '../../../../../../apiFactory/apiHelper'
import { useEffect } from 'react'
import { National_id, payslipOptions} from '../core/_models'
import { useIqamaListView } from '../core/IqamaListViewProvider'
import { string } from 'yup'
import { resourceUsage } from 'process'
//
export const getIqamaDataFromApi = async (id : string) => 
  {
    return await apiHelper.getIqamaForAction(id).then(function(result){return result})
  }

var national_id = 0
var id = 0  || undefined
var expiry_date = ""
var associated_user_id = {username : "" , email : ""}
var iqama:National_id = {}
const UserEditModalFormWrapperIqama = () => {
useEffect(() => 
    {
      var selected_User_id : any = "";
      selected_User_id = itemIqamaForUpdate?.toString()
      const iqamaInfo = getIqamaDataFromApi(selected_User_id)
      iqamaInfo.then(function(result : any)
      {
        iqama = result
        national_id = result.national_id
        expiry_date = result.expiry_date 
        associated_user_id.username = result.associated_user_id.username 
        associated_user_id.email = result.associated_user_id.email 

      })
    },[]
  )
  const {itemIqamaForUpdate, setItemIqamaForUpdate} = useIqamaListView()
  const enabledQuery: boolean = isNotEmpty(itemIqamaForUpdate)
  const {
    isLoading,
    data: user,
    error,
  } = useQuery(
    `${QUERIES.USERS_LIST}-user-${itemIqamaForUpdate}`,
    () => {
      return getUserById(itemIqamaForUpdate)
    },
    {
      cacheTime: 0,
      enabled: enabledQuery,
      onError: (err) => {
        setItemIqamaForUpdate(undefined)
        console.error(err)
      },
    },
  )
  
  if (!itemIqamaForUpdate) {
    return <UserEditModalFormIqama isUserLoading={isLoading} user={{ id: undefined }} iqama={iqama}
    national_id={national_id}
    expiry_date={expiry_date}


    associated_user_id={associated_user_id} payslipOption={payslipOptions.download} payslipOptions={payslipOptions.download} id={iqama.id}    />
  }

  if (!isLoading && !error && user) {
    return <UserEditModalFormIqama isUserLoading={isLoading} user={user} iqama={iqama}


    associated_user_id={associated_user_id}
    national_id={national_id} expiry_date={expiry_date} payslipOption={payslipOptions.download} payslipOptions={payslipOptions.download} id={iqama.id}    
  />
  }

  return null
}

export {UserEditModalFormWrapperIqama}
