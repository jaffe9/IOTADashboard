import {useQuery} from 'react-query'
import {UserEditModalFormIqama} from './IqamaEditModalForm'
import {isNotEmpty, QUERIES} from '../../../../../../_metronic/helpers'
import {useListView} from '../core/ListViewProvider'
import {getUserById} from '../core/_requests'
import { apiHelper } from '../../../../../../apiFactory/apiHelper'
import { useEffect } from 'react'
import { National_id, payslipOptions} from '../core/_models'
//
const getIqamaDataFromApi = async (id : string) => 
  {
    return await apiHelper.getNationalIdExp().then(function(result){return result})
  }
var national_id = ""
var expiry_date = ""
var iqama:National_id= {}
const UserEditModalFormWrapperIqama = () => {
useEffect(() => 
    {
      var selected_User_id : any = "";
      selected_User_id = itemIdForUpdate?.toString()
      const iqamaInfo = getIqamaDataFromApi(selected_User_id)

      iqamaInfo.then(function(result : any)
      {
        iqama = result
        national_id = result.national_id
        expiry_date = result.expiry_date

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
    return <UserEditModalFormIqama isUserLoading={isLoading} user={{ id: undefined }}  national_id={national_id}  expiry_date={expiry_date} 
  
        payslipOption={payslipOptions.download}
        payslipOptions={payslipOptions.email}/>
  }

  if (!isLoading && !error && user) {
    return <UserEditModalFormIqama isUserLoading={isLoading} user={user} national_id={national_id} expiry_date={expiry_date} 
   
    payslipOption={payslipOptions.download} 
    payslipOptions={payslipOptions.email}/>
  }

  return null
}

export {UserEditModalFormWrapperIqama}
