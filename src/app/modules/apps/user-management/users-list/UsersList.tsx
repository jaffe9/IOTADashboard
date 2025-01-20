import {ListViewProvider, useListView} from './core/ListViewProvider'
import {QueryRequestProvider} from './core/QueryRequestProvider'
import {QueryResponseProvider} from './core/QueryResponseProvider'
import {UsersListHeader} from './components/header/UsersListHeader'
import {UsersTable} from './table/UsersTable'
import {UserEditModal} from './user-edit-modal/UserEditModal'
import {IqamaEditModal} from './Iqama-edit-modal/IqamaEditModal'
import {ContractEditModal} from './Contract-edit-modal/ContractEditModal'
import {KTCard} from '../../../../../_metronic/helpers'
import { ToolbarWrapper } from '../../../../../_metronic/layout/components/toolbar'
import { Content } from '../../../../../_metronic/layout/components/content'
import { IqamaListViewProvider, useIqamaListView  } from './core/IqamaListViewProvider'
import { ContractListViewProvider, useContractListView } from './core/ContractListViewProvider'


const UsersList = () => {
  const {itemIdForUpdate} = useListView()
  const {itemIqamaForUpdate} = useIqamaListView()
  const { itemContractForUpdate } = useContractListView()
  
  return (
    <>
      <KTCard>
        <UsersListHeader />
        <UsersTable />
      </KTCard>
      {itemIdForUpdate !== undefined && <UserEditModal />}
      {itemIqamaForUpdate !== undefined && <IqamaEditModal />}
      { itemContractForUpdate !== undefined && <ContractEditModal/>}
    </>
  )
}

const UsersListWrapper = () => (
  <QueryRequestProvider>
    <QueryResponseProvider>
      <ListViewProvider> || <IqamaListViewProvider> || <ContractListViewProvider>
        <ToolbarWrapper />
        <Content>
          <UsersList />
        </Content>
        </ContractListViewProvider> || </IqamaListViewProvider> || </ListViewProvider> 
    </QueryResponseProvider>
  </QueryRequestProvider>
)

export {UsersListWrapper}
