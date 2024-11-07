import {useEffect, useState} from 'react'
import {MenuComponent} from '../../../../../../../_metronic/assets/ts/components'
import {initialQueryState, KTIcon} from '../../../../../../../_metronic/helpers'
import {useQueryRequest} from '../../core/QueryRequestProvider'
import {useQueryResponse} from '../../core/QueryResponseProvider'

interface UserData {
  occupation: string
  last_login: string
}


const UsersListFilter = ({ data = [] }: { data: UserData[] }) => {
  const {updateState} = useQueryRequest()
  const {isLoading} = useQueryResponse()
  const [role, setRole] = useState<string | undefined>()
  const [lastLogin, setLastLogin] = useState<string | undefined>()
  const [filteredData, setFilteredData] = useState(data)  // New state to hold filtered data

  useEffect(() => {
    MenuComponent.reinitialization()
  }, [])

  // Reset filter options
  const resetData = () => {
    setRole(undefined)
    setLastLogin(undefined)
    updateState({filter: undefined, ...initialQueryState})
    setFilteredData(data)  // Reset to original data
  }

  // Apply filter options based on selected values
  const filterData = () => {
    const filterOptions = {
      ...(role ? {occupation: role} : {}),
      ...(lastLogin ? {last_login: lastLogin} : {}),
    }
    
  // Update state with filtered results
       const results = data.filter((item: { occupation: string; last_login: string }) => {
        const matchesRole = role ? item.occupation === role : true
        const matchesLastLogin = lastLogin ? item.last_login === lastLogin : true
        return matchesRole && matchesLastLogin
      })
    setFilteredData(results)  // Set filtered data to display
    updateState({
      filter: filterOptions,
      ...initialQueryState,
    })
  }

  return (
    <>
      {/* Filter Button */}
      <button
        disabled={isLoading}
        type='button'
        className='btn btn-light-primary me-3'
        data-kt-menu-trigger='click'
        data-kt-menu-placement='bottom-end'
      >
        <KTIcon iconName='filter' className='fs-2' />
        Filter
      </button>

      {/* Filter Dropdown Menu */}
      <div className='menu menu-sub menu-sub-dropdown w-300px w-md-325px' data-kt-menu='true'>
        {/* Header */}
        <div className='px-7 py-5'>
          <div className='fs-5 text-gray-900 fw-bolder'>Filter Options</div>
        </div>

        {/* Separator */}
        <div className='separator border-gray-200'></div>

        {/* Filter Content */}
        <div className='px-7 py-5' data-kt-user-table-filter='form'>
          {/* Role Input Group */}
          <div className='mb-10'>
            <label className='form-label fs-6 fw-bold'>Role:</label>
            <select
              className='form-select form-select-solid fw-bolder'
              data-kt-select2='true'
              data-placeholder='Select option'
              data-allow-clear='true'
              data-kt-user-table-filter='role'
              data-hide-search='true'
              onChange={(e) => setRole(e.target.value)}
              value={role}
            >
              <option value=''></option>
              <option value='OutSystems-Senior Developer'>OutSystems-Senior Developer</option>
              <option value='IBM ODM Consultant'>IBM ODM Consultant</option>
              <option value='IBM Filenet Application Support'>IBM Filenet Application Support</option>
              <option value='APIGee Administrator'>APIGee Administrator</option>
              <option value='IBM Data Power / API Connect Support Consultant'>IBM Data Power / API Connect Support Consultant</option>
              <option value='OutSystems-Senior Backend Developer'>OutSystems-Senior Backend Developer</option>
              <option value='Senior Informatica Consultant'>Senior Informatica Consultant</option>
              <option value='Business Relationship Consultant'>Business Relationship Consultant</option>
              <option value='IBM BPM Support Consultant'>IBM BPM Support Consultant</option>
            </select>
          </div>

          {/* Last Login Input Group */}
          {/* <div className='mb-10'>
            <label className='form-label fs-6 fw-bold'>Last login:</label>
            <select
              className='form-select form-select-solid fw-bolder'
              data-kt-select2='true'
              data-placeholder='Select option'
              data-allow-clear='true'
              data-kt-user-table-filter='two-step'
              data-hide-search='true'
              onChange={(e) => setLastLogin(e.target.value)}
              value={lastLogin || ''}
            >
              <option value=''></option>
              <option value='Yesterday'>Yesterday</option>
              <option value='20 mins ago'>20 mins ago</option>
              <option value='5 hours ago'>5 hours ago</option>
              <option value='2 days ago'>2 days ago</option>
            </select>
          </div> */}

          {/* Actions */}
          <div className='d-flex justify-content-end'>
            <button
              type='button'
              disabled={isLoading}
              onClick={resetData}
              className='btn btn-light btn-active-light-primary fw-bold me-2 px-6'
              data-kt-menu-dismiss='true'
              data-kt-user-table-filter='reset'
            >
              Reset
            </button>
            <button
              disabled={isLoading}
              type='button'
              onClick={filterData}
              className='btn btn-primary fw-bold px-6'
              data-kt-menu-dismiss='true'
              data-kt-user-table-filter='filter'
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export {UsersListFilter}
