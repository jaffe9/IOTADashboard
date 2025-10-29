import {lazy, FC, Suspense} from 'react'
import {Route, Routes, Navigate} from 'react-router-dom'
import {MasterLayout} from '../../_metronic/layout/MasterLayout'
import TopBarProgress from 'react-topbar-progress-indicator'
import {DashboardWrapper} from '../pages/dashboard/DashboardWrapper'
import {getCSSVariableValue} from '../../_metronic/assets/ts/_utils'
import {WithChildren} from '../../_metronic/helpers'
import BuilderPageWrapper from '../pages/layout-builder/BuilderPageWrapper'
import OpportunityPage from '../modules/apps/opportunity/OpportunityPage'
import { CreateProposal } from '../pages/proposalPage/createProposal'
import { CreatePastEmployee } from '../pages/createEmployee/createPastEmployee'
import { TablesWidget15 } from '../../_metronic/partials/widgets/tables/TablesWidget15'
import { CreatePayslip } from '../pages/Payslips/createPayslips'
import { CreateNationalIdInfo } from '../pages/NationalIdPage/createNationalId'
import { CreateLeaveEntitlement } from '../pages/LeavePage/createLeaveEntitlment'

const PrivateRoutes = () => {
  // Existing lazy loaded components
  const ProfilePage = lazy(() => import('../modules/profile/ProfilePage'))
  const WizardsPage = lazy(() => import('../modules/wizards/WizardsPage'))
  const AccountPage = lazy(() => import('../modules/accounts/AccountPage'))
  const WidgetsPage = lazy(() => import('../modules/widgets/WidgetsPage'))
  const ChatPage = lazy(() => import('../modules/apps/chat/ChatPage'))
  const UsersPage = lazy(() => import('../modules/apps/user-management/UsersPage'))
  
  // New lazy loaded components
  const ClaimPageWrapper = lazy(() => import('../pages/claimPage/ClaimPageWrapper'))
  const MenuTestPage = lazy(() => import('../pages/MenuTestPage').then(module => ({ default: module.MenuTestPage })))
  const EmployeeTimesheetWrapper = lazy(() => import('../pages/employeeTimesheet/EmployeeTimesheetWrapper'))
  const EmployeeInvoiceWrapper = lazy(() => import('../pages/employeeInvoice/EmployeeInvoiceWrapper'))
  const ContractPageWrapper = lazy(() => import('../pages/contractPage/ContractPageWrapper'))
  const CreateEmployeeWrapper = lazy(() => import('../pages/createEmployee/CreateEmployeeWrapper'))
  const UpdateEmployee = lazy(() => import('../pages/createEmployee/UpdateEmployee').then(module => ({ default: module.UpdateEmployee })))
  const CreatePayslip = lazy(() => import('../pages/Payslips/createPayslips').then(module => ({ default: module.CreatePayslip })))
  const GetInvoiceDetails = lazy(() => import('../pages/invoiceInfo/invoiceDetails').then(module => ({ default: module.GetInvoiceDetails })))
  const UpdateSalary = lazy(() => import('../pages/salaryIncrement/updateSalary').then(module => ({ default: module.UpdateSalary })))
  const AddNewSalary = lazy(() => import('../pages/salaryIncrement/Salary').then(module => ({ default: module.AddNewSalary })))
  const ExpenseManager = lazy(() => import('../pages/claimPage/ExpenseManager'))
  return (
    <Routes>
      <Route element={<MasterLayout />}>
        {/* Redirect to Dashboard after success login/registartion */}
        <Route path='auth/*' element={<Navigate to='/dashboard' />} />
        {/* Pages */}
        <Route path='dashboard' element={<DashboardWrapper />} />
        <Route path='builder' element={<BuilderPageWrapper />} />
        
        {/* Updated routes with lazy loading */}
        <Route
          path='claim'
          element={
            <SuspensedView>
              <ClaimPageWrapper />
            </SuspensedView>
          }
        />
        <Route
          path='menu-test'
          element={
            <SuspensedView>
              <MenuTestPage />
            </SuspensedView>
          }
        />
        <Route
          path='employeetimesheet'
          element={
            <SuspensedView>
              <EmployeeTimesheetWrapper />
            </SuspensedView>
          }
        />
        <Route
          path='employeePayslip'
          element={
            <SuspensedView>
              <CreatePayslip />
            </SuspensedView>
          }
        />
        <Route
          path='employeeinvoice'
          element={
            <SuspensedView>
              <EmployeeInvoiceWrapper />
            </SuspensedView>
          }
        />
        <Route
          path='contract'
          element={
            <SuspensedView>
              <ContractPageWrapper />
            </SuspensedView>
          }
        />
        <Route
          path='createTempEmp'
          element={
            <SuspensedView>
              <CreateEmployeeWrapper />
            </SuspensedView>
          }
        />
        <Route
          path='updateTempEmp'
          element={
            <SuspensedView>
              <UpdateEmployee />
            </SuspensedView>
          }
        />
        <Route
          path='getInvoiceDetails'
          element={
            <SuspensedView>
              <GetInvoiceDetails className={''} />
            </SuspensedView>
          }
        />
        <Route
          path='updateSalary'
          element={
            <SuspensedView>
              <UpdateSalary />
            </SuspensedView>
          }
        />
        <Route
          path='Salary'
          element={
            <SuspensedView>
              <AddNewSalary />
            </SuspensedView>
          }
        />
        <Route
          path='createProposal'
          element={
            <SuspensedView>
              <CreateProposal />
            </SuspensedView>
          }
        />
        <Route
          path='createPastEmployee'
          element={
            <SuspensedView>
              <CreatePastEmployee />
            </SuspensedView>
          }
        />
        <Route
          path='pastEmpDetails'
          element={
            <SuspensedView>
              <TablesWidget15 className='card-xxl-stretch mb-5 mb-xl-8'/>
            </SuspensedView>
          }
        />
        <Route
          path='/dashboard/expenses'
          element={
            <SuspensedView>
              <ExpenseManager />
            </SuspensedView>
          }
        />
        <Route
          path='/dashboard/postNatId'
          element={
            <SuspensedView>
              <CreateNationalIdInfo />
            </SuspensedView>
          }
        />
        <Route
          path='/dashboard/postLeaveEntlment'
          element={
            <SuspensedView>
              <CreateLeaveEntitlement />
            </SuspensedView>
          }
        />
        
        {/* Existing Lazy Modules */}
        <Route
          path='crafted/pages/profile/*'
          element={
            <SuspensedView>
              <ProfilePage />
            </SuspensedView>
          }
        />
        <Route
          path='crafted/pages/wizards/*'
          element={
            <SuspensedView>
              <WizardsPage />
            </SuspensedView>
          }
        />
        <Route
          path='crafted/widgets/*'
          element={
            <SuspensedView>
              <WidgetsPage />
            </SuspensedView>
          }
        />
        <Route
          path='crafted/account/*'
          element={
            <SuspensedView>
              <AccountPage />
            </SuspensedView>
          }
        />
        <Route
          path='apps/chat/*'
          element={
            <SuspensedView>
              <ChatPage />
            </SuspensedView>
          }
        />
        <Route
          path='apps/opportunity/*'
          element={
            <SuspensedView>
              <OpportunityPage />
            </SuspensedView>
          }
        />
        <Route
          path='apps/user-management/*'
          element={
            <SuspensedView>
              <UsersPage />
            </SuspensedView>
          }
        />
        {/* Page Not Found */}
        <Route path='*' element={<Navigate to='/error/404' />} />
      </Route>
    </Routes>
  )
}

const SuspensedView: FC<WithChildren> = ({children}) => {
  const baseColor = getCSSVariableValue('--bs-primary')
  TopBarProgress.config({
    barColors: {
      '0': baseColor,
    },
    barThickness: 1,
    shadowBlur: 5,
  })
  return <Suspense fallback={<TopBarProgress />}>{children}</Suspense>
}

export {PrivateRoutes}