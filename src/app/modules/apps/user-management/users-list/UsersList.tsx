import {ListViewProvider, useListView} from './core/ListViewProvider'
import {QueryRequestProvider} from './core/QueryRequestProvider'
import {QueryResponseProvider} from './core/QueryResponseProvider'
import {UsersListHeader} from './components/header/UsersListHeader'
import {UsersTable} from './table/UsersTable'
import {UserEditModal} from './user-edit-modal/UserEditModal'
import {IqamaEditModal} from './Iqama-edit-modal/IqamaEditModal'
import {KTCard} from '../../../../../_metronic/helpers'
import { ToolbarWrapper } from '../../../../../_metronic/layout/components/toolbar'
import { Content } from '../../../../../_metronic/layout/components/content'
import { IqamaListViewProvider, useIqamaListView } from './core/IqamaListViewProvider'


const UsersList = () => {
  const {itemIdForUpdate} = useListView()
  const {itemIqamaForUpdate} = useIqamaListView()
  return (
    <>
      <KTCard>
        <UsersListHeader />
        <UsersTable />
      </KTCard>
      {itemIdForUpdate !== undefined && <UserEditModal />}
      {itemIqamaForUpdate !== undefined && <IqamaEditModal />}
    </>
  )
}

const UsersListWrapper = () => (
  <QueryRequestProvider>
    <QueryResponseProvider>
      <ListViewProvider> || <IqamaListViewProvider>
        <ToolbarWrapper />
        <Content>
          <UsersList />
        </Content>
      </IqamaListViewProvider> || </ListViewProvider>
    </QueryResponseProvider>
  </QueryRequestProvider>
)

export {UsersListWrapper}
