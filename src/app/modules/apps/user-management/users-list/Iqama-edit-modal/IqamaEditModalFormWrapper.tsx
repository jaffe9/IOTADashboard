/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from 'react-query'
import { UserEditModalFormIqama } from './IqamaEditModalForm'
import { isNotEmpty, QUERIES } from '../../../../../../_metronic/helpers'
import { getUserById } from '../core/_requests'
import { apiHelper } from '../../../../../../apiFactory/apiHelper'
import { useEffect, useState } from 'react'
import { National_id, payslipOptions } from '../core/_models'
import { useIqamaListView } from '../core/IqamaListViewProvider'

// Move this to a separate file to fix Fast Refresh
export const getIqamaDataFromApi = async (id: string) => {
  return await apiHelper.getIqamaForAction(id).then(function (result) {
    return result
  })
}

const UserEditModalFormWrapperIqama = () => {
  // Use React state instead of module-level variables
  const [iqamaData, setIqamaData] = useState<any>({
    iqama: {},
    national_id: 0,
    expiry_date: "",
    associated_user_id: { username: "", email: "" }
  })
  
  const [isIqamaLoading, setIsIqamaLoading] = useState(false)

  const { itemIqamaForUpdate, setItemIqamaForUpdate } = useIqamaListView()

  useEffect(() => {
    if (itemIqamaForUpdate) {
      setIsIqamaLoading(true)
      const selected_User_id: any = itemIqamaForUpdate.toString()
      
      getIqamaDataFromApi(selected_User_id)
        .then(function (result: any) {
          setIqamaData({
            iqama: result,
            national_id: result.national_id,
            expiry_date: result.expiry_date,
            associated_user_id: {
              username: result.associated_user_id.username,
              email: result.associated_user_id.email
            }
          })
          setIsIqamaLoading(false)
        })
        .catch((error) => {
          console.error('Error fetching Iqama data:', error)
          setIsIqamaLoading(false)
        })
    }
  }, [itemIqamaForUpdate]) // Add dependency

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
    }
  )

  if (!itemIqamaForUpdate) {
    return (
      <UserEditModalFormIqama
        isUserLoading={isLoading || isIqamaLoading}
        user={{ id: undefined }}
        iqama={iqamaData.iqama}
        national_id={iqamaData.national_id}
        expiry_date={iqamaData.expiry_date}
        associated_user_id={iqamaData.associated_user_id}
        payslipOption={payslipOptions.download}
        payslipOptions={payslipOptions.download}
        id={iqamaData.iqama.id}
      />
    )
  }

  if (!isLoading && !error && user) {
    return (
      <UserEditModalFormIqama
        isUserLoading={isLoading || isIqamaLoading}
        user={user}
        iqama={iqamaData.iqama}
        associated_user_id={iqamaData.associated_user_id}
        national_id={iqamaData.national_id}
        expiry_date={iqamaData.expiry_date}
        payslipOption={payslipOptions.download}
        payslipOptions={payslipOptions.download}
        id={iqamaData.iqama.id}
      />
    )
  }

  return null
}

export { UserEditModalFormWrapperIqama }