/* eslint-disable react-refresh/only-export-components */
import {FC, useState, createContext, useContext, useMemo} from 'react'
import {
  calculatedGroupingIsDisabled,
  calculateIsAllDataSelected,
  ContractListViewContextProps,
  WithChildren,
  Contract,
  contractInitialListView,
  groupingContractOnSelect,
  groupingContractOnSelectAll,
} from '../../../../../../_metronic/helpers'
import {useQueryResponse, useQueryResponseData} from './QueryResponseProvider'


const ContractListViewContext = createContext<ContractListViewContextProps>(contractInitialListView)

const ContractListViewProvider: FC<WithChildren> = ({children}) => {
  const [selected, setSelected] = useState<Array<Contract>>(contractInitialListView.selected)
  const [itemContractForUpdate, setItemContractForUpdate] = useState<Contract>(contractInitialListView.itemContractForUpdate)
  const {isLoading} = useQueryResponse()
  const data = useQueryResponseData()
  const disabled = useMemo(() => calculatedGroupingIsDisabled(isLoading, data), [isLoading, data])
  const isAllSelected = useMemo(() => calculateIsAllDataSelected(data, selected), [data, selected])

  return (
    <ContractListViewContext.Provider
      value={{
        selected,
        itemContractForUpdate,
        setItemContractForUpdate,
        disabled,
        isAllSelected,
        onSelect: (id: Contract) => {
            groupingContractOnSelect(id, selected, setSelected)
        },
        onSelectAll: () => {
          groupingContractOnSelectAll(isAllSelected, setSelected, data)
        },
        clearSelected: () => {
          setSelected([])
        },
      }}
    >
      {children}
    </ContractListViewContext.Provider>
  )
}

const useContractListView = () => useContext(ContractListViewContext)

export {ContractListViewProvider, useContractListView}
