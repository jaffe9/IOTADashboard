/* eslint-disable react-refresh/only-export-components */
import {FC, useState, createContext, useContext, useMemo} from 'react'
import {
  calculatedGroupingIsDisabled,
  calculateIsAllDataSelected,
  IqamaListViewContextProps,
  WithChildren,
  Iqama,
  iqamaInitialListView,
  groupingIqamaOnSelect,
  groupingIqamaOnSelectAll,
} from '../../../../../../_metronic/helpers'
import {useQueryResponse, useQueryResponseData} from './QueryResponseProvider'


const IqamaListViewContext = createContext<IqamaListViewContextProps>(iqamaInitialListView)

const IqamaListViewProvider: FC<WithChildren> = ({children}) => {
  const [selected, setSelected] = useState<Array<Iqama>>(iqamaInitialListView.selected)
  const [itemIqamaForUpdate, setItemIqamaForUpdate] = useState<Iqama>(iqamaInitialListView.itemIqamaForUpdate)
  const {isLoading} = useQueryResponse()
  const data = useQueryResponseData()
  const disabled = useMemo(() => calculatedGroupingIsDisabled(isLoading, data), [isLoading, data])
  const isAllSelected = useMemo(() => calculateIsAllDataSelected(data, selected), [data, selected])

  return (
    <IqamaListViewContext.Provider
      value={{
        selected,
        itemIqamaForUpdate,
        setItemIqamaForUpdate,
        disabled,
        isAllSelected,
        onSelect: (id: Iqama) => {
            groupingIqamaOnSelect(id, selected, setSelected)
        },
        onSelectAll: () => {
          groupingIqamaOnSelectAll(isAllSelected, setSelected, data)
        },
        clearSelected: () => {
          setSelected([])
        },
      }}
    >
      {children}
    </IqamaListViewContext.Provider>
  )
}

const useIqamaListView = () => useContext(IqamaListViewContext)

export {IqamaListViewProvider, useIqamaListView}
