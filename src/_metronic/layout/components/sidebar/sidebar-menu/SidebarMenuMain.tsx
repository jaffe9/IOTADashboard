import {useIntl} from 'react-intl'
import {KTIcon} from '../../../../helpers'
import {SidebarMenuItemWithSub} from './SidebarMenuItemWithSub'
import {SidebarMenuItem} from './SidebarMenuItem'

const SidebarMenuMain = () => {
  const intl = useIntl()

  return (
    <>
      <SidebarMenuItem
        to='/dashboard'
        icon='element-11'
        title={intl.formatMessage({id: 'MENU.DASHBOARD'})}
        fontIcon='bi-app-indicator'
      />
      {/* <SidebarMenuItem to='/builder' icon='switch' title='Layout Builder' fontIcon='bi-layers' /> */}
      <div className='menu-item'>
        <div className='menu-content pt-8 pb-2'>
          <span className='menu-section text-muted text-uppercase fs-8 ls-1'>Account Manager Section</span>
        </div>
      </div>
      <SidebarMenuItemWithSub 
      to={''} 
      icon = 'abstract-26'
      title={'Salary'}>
     
      <div className='menu-item'> 
         <SidebarMenuItem to='/Salary' icon='wallet' title='Open Account' fontIcon='bi-layers' />
         <SidebarMenuItem to='/updateSalary' icon='finance-calculator' title='Update Account' fontIcon='bi-layers' />
      </div>
      </SidebarMenuItemWithSub>
      <SidebarMenuItem to='/createTempEmp' icon='profile-user' title='Create New Employee' fontIcon='bi-layers' />
      <div className='menu-item'></div>
      <SidebarMenuItem to='/employeetimesheet' icon='calendar-add' title='Employee Timesheet' fontIcon='bi-layers' />
      <div className='menu-item'>
      </div>
      <SidebarMenuItem to='/employeeinvoice' icon='questionnaire-tablet' title='Employee Invoice' fontIcon='bi-layers' />
      <div className='menu-item'>
      </div>
      <SidebarMenuItem to='/contract' icon='badge' title='Employee Contract' fontIcon='bi-layers' />
      <div className='menu-item'>
      </div>
      <SidebarMenuItem to='/claim' icon='dollar' title='Claims' fontIcon='bi-layers' />
      <SidebarMenuItem to='/getInvoiceDetails' icon='note-2' title='Invoice Details' fontIcon='bi-layers' />
      <div className='menu-item'>
      </div>
      <div className='menu-item'>
        <div className='menu-content pt-8 pb-2'>
          <span className='menu-section text-muted text-uppercase fs-8 ls-1'>Sales</span>
        </div>
      </div>
      
      {/* <SidebarMenuItemWithSub
        to='/crafted/pages'
        title='Pages'
        fontIcon='bi-archive'
        icon='element-plus'
      >
        <SidebarMenuItemWithSub to='/crafted/pages/profile' title='Profile' hasBullet={true}>
          <SidebarMenuItem to='/crafted/pages/profile/overview' title='Overview' hasBullet={true} />
          <SidebarMenuItem to='/crafted/pages/profile/projects' title='Projects' hasBullet={true} />
          <SidebarMenuItem
            to='/crafted/pages/profile/campaigns'
            title='Campaigns'
            hasBullet={true}
          />
          <SidebarMenuItem
            to='/crafted/pages/profile/documents'
            title='Documents'
            hasBullet={true}
          />
          <SidebarMenuItem
            to='/crafted/pages/profile/connections'
            title='Connections'
            hasBullet={true}
          />
        </SidebarMenuItemWithSub>

        <SidebarMenuItemWithSub to='/crafted/pages/wizards' title='Wizards' hasBullet={true}>
          <SidebarMenuItem
            to='/crafted/pages/wizards/horizontal'
            title='Horizontal'
            hasBullet={true}
          />
          <SidebarMenuItem to='/crafted/pages/wizards/vertical' title='Vertical' hasBullet={true} />
        </SidebarMenuItemWithSub>
      </SidebarMenuItemWithSub> */}
     
      {/* <SidebarMenuItemWithSub
        to='/crafted/accounts'
        title='Accounts'
        icon='profile-circle'
        fontIcon='bi-person'
      >
        <SidebarMenuItem to='/crafted/account/overview' title='Overview' hasBullet={true} />
        <SidebarMenuItem to='/crafted/account/settings' title='Settings' hasBullet={true} />
      </SidebarMenuItemWithSub> */}

      {/* <SidebarMenuItemWithSub to='/error' title='Errors' fontIcon='bi-sticky' icon='cross-circle'>
        <SidebarMenuItem to='/error/404' title='Error 404' hasBullet={true} />
        <SidebarMenuItem to='/error/500' title='Error 500' hasBullet={true} />
      </SidebarMenuItemWithSub> */}

      <SidebarMenuItemWithSub
        to='/crafted/widgets'
        title='Sales Pipeline'
        icon='graph-up'
        fontIcon='multi-layers'
      >
        {/* <SidebarMenuItem to='/crafted/widgets/lists' title='Lists' hasBullet={true} />
        <SidebarMenuItem to='/crafted/widgets/statistics' title='Statistics' hasBullet={true} />
        <SidebarMenuItem to='/crafted/widgets/charts' title='Charts' hasBullet={true} /> */}
        <SidebarMenuItem to='/crafted/widgets/mixed' title='Sales Graphs' hasBullet={true} />
        {/* <SidebarMenuItem to='/crafted/widgets/tables' title='Tables' hasBullet={true} />
        <SidebarMenuItem to='/crafted/widgets/opportunities' title='Opportunities' hasBullet={true} />
        <SidebarMenuItem to='/crafted/widgets/feeds' title='Feeds' hasBullet={true} /> */}
      </SidebarMenuItemWithSub>

      <div className='menu-item'>
        <div className='menu-content pt-8 pb-2'>
          <span className='menu-section text-muted text-uppercase fs-8 ls-1'>Team</span>
        </div>
      </div>

      {/* <SidebarMenuItemWithSub
        to='/apps/chat'
        title='Chat'
        fontIcon='bi-chat-left'
        icon='message-text-2'
      >
        <SidebarMenuItem to='/apps/chat/private-chat' title='Private Chat' hasBullet={true} />
        <SidebarMenuItem to='/apps/chat/group-chat' title='Group Chart' hasBullet={true} />
        <SidebarMenuItem to='/apps/chat/drawer-chat' title='Drawer Chart' hasBullet={true} />
      </SidebarMenuItemWithSub> */}
      <SidebarMenuItem
        to='/apps/user-management/users'
        icon='user'
        title='User management'
        fontIcon='bi-layers'
      />

      {/* <div className='menu-item'>
        <a
          target='_blank'
          className='menu-link'
          href={import.meta.env.VITE_APP_PREVIEW_DOCS_URL + '/changelog'}
        >
          <span className='menu-icon'>
            <KTIcon iconName='code' className='fs-2' />
          </span>
          <span className='menu-title'>Changelog {import.meta.env.VITE_APP_VERSION}</span>
        </a>
      </div> */}
      
    </>
  )
}

export {SidebarMenuMain}
