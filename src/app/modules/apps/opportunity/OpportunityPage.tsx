import {Navigate, Route, Routes, Outlet} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../../_metronic/layout/core'
import {Private} from './components/Private'
import {Group} from './components/Group'
import {Drawer} from './components/Drawer'

const opportunityBreadCrumbs: Array<PageLink> = [
  {
    title: 'Opportunity',
    path: '/apps/opportunity',
    isSeparator: false,
    isActive: false,
  },
  {
    title: 'Opportunities',
    path: '',
    isSeparator: true,
    isActive: false,
  },
]

const OpportunityPage = () => {
  return (
    <Routes>
      <Route element={<Outlet />}>
        <Route
          path='private-chat'
          element={
            <>
              <PageTitle breadcrumbs={opportunityBreadCrumbs}>Private chat</PageTitle>
              <Private />
            </>
          }
        />
        <Route
          path='group-chat'
          element={
            <>
              <PageTitle breadcrumbs={opportunityBreadCrumbs}>Group chat</PageTitle>
              <Group />
            </>
          }
        />
        <Route
          path='drawer-chat'
          element={
            <>
              <PageTitle breadcrumbs={opportunityBreadCrumbs}>Drawer chat</PageTitle>
              <Drawer />
            </>
          }
        />
        <Route index element={<Navigate to='/apps/opportunity/private-chat' />} />
      </Route>
    </Routes>
  )
}

export default OpportunityPage
