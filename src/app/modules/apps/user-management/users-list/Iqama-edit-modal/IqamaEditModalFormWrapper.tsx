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
  const [iqamaError, setIqamaError] = useState<string | null>(null)
  const [iqamaDataLoaded, setIqamaDataLoaded] = useState(false) // Track if Iqama data is loaded

  const { itemIqamaForUpdate, setItemIqamaForUpdate } = useIqamaListView()

  useEffect(() => {
    if (itemIqamaForUpdate) {
      setIsIqamaLoading(true)
      setIqamaError(null) // Reset error state
      setIqamaDataLoaded(false) // Reset loaded state
      const selected_User_id: any = itemIqamaForUpdate.toString()
      
      getIqamaDataFromApi(selected_User_id)
        .then(function (result: any) {
          // Check if result exists and has the required data
          if (!result || !result.national_id) {
            setIqamaError('National ID information not found for this user. Please update the National ID records first.')
            setIsIqamaLoading(false)
            setIqamaDataLoaded(true)
            return
          }

          setIqamaData({
            iqama: result,
            national_id: result.national_id,
            expiry_date: result.expiry_date,
            associated_user_id: {
              username: result.associated_user_id?.username || "",
              email: result.associated_user_id?.email || ""
            }
          })
          setIsIqamaLoading(false)
          setIqamaDataLoaded(true) // Mark as loaded
        })
        .catch((error) => {
          console.error('Error fetching Iqama data:', error)
          setIqamaError('Unable to load National ID information. Please ensure the user has National ID records registered.')
          setIsIqamaLoading(false)
          setIqamaDataLoaded(true)
        })
    }
  }, [itemIqamaForUpdate])

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

  // Show error message if there's an Iqama data error
  if (iqamaError) {
    return (
      <div className="alert alert-danger d-flex align-items-center p-5 mb-10">
        <span className="svg-icon svg-icon-2hx svg-icon-danger me-4">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path opacity="0.3" d="M20.5543 4.37824L12.1798 2.02473C12.0626 1.99176 11.9376 1.99176 11.8203 2.02473L3.44572 4.37824C3.18118 4.45258 3 4.6807 3 4.93945V13.569C3 14.6914 3.48509 15.8404 4.4417 16.984C5.17231 17.8575 6.18314 18.7345 7.446 19.5909C9.56752 21.0295 11.6566 21.912 11.7445 21.9488C11.8258 21.9829 11.9129 22 12.0001 22C12.0872 22 12.1744 21.983 12.2557 21.9488C12.3435 21.912 14.4326 21.0295 16.5541 19.5909C17.8169 18.7345 18.8277 17.8575 19.5584 16.984C20.515 15.8404 21 14.6914 21 13.569V4.93945C21 4.6807 20.8189 4.45258 20.5543 4.37824Z" fill="currentColor"></path>
            <path d="M10.5606 11.3042L9.57283 10.3018C9.28174 10.0065 8.80522 10.0065 8.51412 10.3018C8.22897 10.5912 8.22897 11.0559 8.51412 11.3452L10.4182 13.2773C10.8099 13.6747 11.451 13.6747 11.8427 13.2773L15.4859 9.58051C15.771 9.29117 15.771 8.82648 15.4859 8.53714C15.1948 8.24176 14.7183 8.24176 14.4272 8.53714L11.7002 11.3042C11.3869 11.6221 10.874 11.6221 10.5606 11.3042Z" fill="currentColor"></path>
          </svg>
        </span>
        <div className="d-flex flex-column">
          <h4 className="mb-1 text-danger">National ID Information Missing</h4>
          <span>{iqamaError}</span>
        </div>
      </div>
    )
  }

  // Wait for BOTH user data and Iqama data to load
  const isBothDataLoading = isLoading || isIqamaLoading || !iqamaDataLoaded

  if (!itemIqamaForUpdate) {
    return (
      <UserEditModalFormIqama
        isUserLoading={isBothDataLoading}
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

  // Only render the form when BOTH user and Iqama data are ready
  if (!isBothDataLoading && !error && user && iqamaDataLoaded) {
    return (
      <UserEditModalFormIqama
        isUserLoading={false}
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

  // Show loading state while either data is loading
  return null
}

export { UserEditModalFormWrapperIqama }