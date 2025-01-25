import { useIntl } from 'react-intl';
// import {KTIcon} from '../../../../helpers'
import { SidebarMenuItemWithSub } from './SidebarMenuItemWithSub';
import { SidebarMenuItem } from './SidebarMenuItem';
import { useAuth } from '../../../../../app/modules/auth';
import { IsAHolding } from '../../../../../app/utils/permissionAccessHandler';

const SidebarMenuMain = () => {
  const intl = useIntl();

  const { logout } = useAuth();



  return (
    <>
      <div className="mb-2">
        <SidebarMenuItem
          to="/dashboard"
          icon="element-11"
          permission="PASS"
          title={intl.formatMessage({ id: 'MENU.DASHBOARD' })}
          fontIcon="bi-app-indicator"
        />
      </div>
{/* 
      {
        !IsAHolding() && 
      } */}

      {
        !IsAHolding() && 

        <SidebarMenuItemWithSub
          permission="PASS"
          to="#"
          title={intl.formatMessage({ id: 'CLAIM.COLLECTION' })}
          icon="basket"
        >
          <SidebarMenuItem
            permission="claims:create"
            to="/claims/new"
            title={intl.formatMessage({ id: 'CLAIM.RECORD' })}
            hasBullet={true}
          />
          <SidebarMenuItem
            permission="claims:read"
            to="/claims/not-complete"
            title={intl.formatMessage({ id: 'CLAIM.NOT_COMPLETE' })}
            hasBullet={true}
          />
        </SidebarMenuItemWithSub>

      }

      <SidebarMenuItemWithSub
        permission="PASS"
        to="#"
        title={intl.formatMessage({ id: 'CLAIM.TREATMENT' })}
        icon="sort"
      >
        <SidebarMenuItem
          permission="claims:read"
          to="/claims/completed"
          title={intl.formatMessage({ id: 'CLAIM.COMPLETE' })}
          hasBullet={true}
        />
        <SidebarMenuItem
          permission="claims:read"
          to="/claims/to-assign"
          title={intl.formatMessage({ id: 'CLAIM.CLAIM_TO_ASSIGN' })}
          hasBullet={true}
        />
        <SidebarMenuItem
          permission="claims:read"
          to="/claims/to-treat"
          title={intl.formatMessage({ id: 'CLAIM.CLAIM_TO_TREAT' })}
          hasBullet={true}
        />
        <SidebarMenuItem
          permission="claims:read"
          to="/claims/to-valid"
          title={intl.formatMessage({ id: 'CLAIM.CLAIM_TO_VALIDATE' })}
          hasBullet={true}
        />
        <SidebarMenuItem
          permission="claims:read"
          to="/claims/to-notify"
          title={intl.formatMessage({ id: 'CLAIM.CLAIM_TO_NOTIFY' })}
          hasBullet={true}
        />
        {/* <SidebarMenuItem
          permission="claims:read"
          to="/claims/to-close"
          title={intl.formatMessage({ id: 'CLAIM.CLAIM_TO_CLOSE' })}
          hasBullet={true}
        /> */}

        <SidebarMenuItem
          permission="claims:read"
          to="/claims/not-founded"
          title={intl.formatMessage({ id: 'CLAIM.CLAIM_NOT_FOUNDED' })}
          hasBullet={true}
        />

        {/* <SidebarMenuItem permission='claims:read' to='#' title={intl.formatMessage({id: 'CLAIM.DEDUPLICATION'})} hasBullet={true} />
          <SidebarMenuItem permission='claims:read' to='#' title={intl.formatMessage({id: 'CLAIM.DISCUSSION'})} hasBullet={true} /> */}
      </SidebarMenuItemWithSub>

      {/* <SidebarMenuItemWithSub permission='admin' to='#' title={intl.formatMessage({id: 'CLAIM.ESCALADE'})} icon='bucket'>

          <SidebarMenuItem permission='claims:read' to='/claims/measured' title={intl.formatMessage({id: 'CLAIM.LIST_OF_UNSATISFIED_CLAIM'})} hasBullet={true} />
          <SidebarMenuItem permission='admin' to='#' title={intl.formatMessage({id: 'CLAIM.TO_TREAT_BY_COMMITY'})} hasBullet={true} />

      </SidebarMenuItemWithSub> */}

      <SidebarMenuItem
        permission="claims:read"
        to="/claims/closed"
        title={intl.formatMessage({ id: 'GEN.ARCHIVES' })}
        icon="archive"
      />

      <SidebarMenuItem
        permission="claims:read"
        to="/claims/measured"
        title={intl.formatMessage({ id: 'CLAIM.MESURED' })}
        icon="compass"
      />

      <SidebarMenuItemWithSub
        permission="PASS"
        to="#"
        title={intl.formatMessage({ id: 'CLAIMS_REPORT.REPORT' })}
        icon="logistic"
      >
        <SidebarMenuItem
          permission="PASS"
          to="/reports/late-treatment"
          title={intl.formatMessage({ id: 'CLAIMS_REPORT.TREATMENT_LATE' })}
          hasBullet={true}
        />
        {/* <SidebarMenuItem
          permission="PASS"
          to="/reports/late-treatment/by/30"
          title={intl.formatMessage({ id: 'CLAIMS_REPORT.TREATMENT_LATE_FOR_30DAYS' })}
          hasBullet={true}
        /> */}
        <SidebarMenuItem
          permission="PASS"
          to="/reports/analytics"
          title={intl.formatMessage({ id: 'CLAIMS_REPORT.ANALYTICS' })}
          hasBullet={true}
        />
      </SidebarMenuItemWithSub>

      <SidebarMenuItemWithSub
        permission="admin"
        to="#"
        title={intl.formatMessage({ id: 'GEN.CUSTOMER' })}
        icon="logistic"
      >
        <SidebarMenuItem
          permission="admin"
          to="/customers/list"
          title={intl.formatMessage({ id: 'GEN.CUSTOMER_LIST' })}
          hasBullet={true}
        />
        <SidebarMenuItem
          permission="admin"
          to="/customers/types"
          title={intl.formatMessage({ id: 'SETTINGS.CUSTOMER_TYPE' })}
          hasBullet={true}
        />
      </SidebarMenuItemWithSub>

      <SidebarMenuItemWithSub
        permission="PASS"
        to="/settings/"
        title={intl.formatMessage({ id: 'SETTINGS.SETTINGS' })}
        icon="element-plus"
      >
        <SidebarMenuItem
          permission="category:read"
          to="/settings/complaint-category"
          title={intl.formatMessage({ id: 'SETTINGS.COMPLAINT_CATEGORY' })}
          hasBullet={true}
        />
        <SidebarMenuItem
          permission="duration_treatment:read"
          to="/settings/prossessing-times"
          title={intl.formatMessage({ id: 'SETTINGS.PROSSESSING_TIMES' })}
          hasBullet={true}
        />
        <SidebarMenuItem
          permission="severity_level:read"
          to="/settings/severity-level"
          title={intl.formatMessage({ id: 'SETTINGS.SEVERITY_LEVEL' })}
          hasBullet={true}
        />
        <SidebarMenuItem
          permission="object:read"
          to="/settings/complaint-object"
          title={intl.formatMessage({ id: 'SETTINGS.COMPLAINT_OBJECT' })}
          hasBullet={true}
        />
        <SidebarMenuItem
          permission="currency:read"
          to="/settings/currency"
          title={intl.formatMessage({ id: 'SETTINGS.CURRENCY' })}
          hasBullet={true}
        />

        {
          // only a holding institution can see this menu
          IsAHolding() && (
            <>
              <SidebarMenuItem
                permission="institution_type:read"
                to="/settings/institution-type"
                title={intl.formatMessage({ id: 'SETTINGS.INSTITUTION_TYPE' })}
                hasBullet={true}
              />
              <SidebarMenuItem
                permission="institution:read"
                to="/settings/institution"
                title={intl.formatMessage({ id: 'SETTINGS.INSTITUTION' })}
                hasBullet={true}
              />
            </>
          )
        }

        {/* <SidebarMenuItem permission='insurance_type:read' to='/settings/insurrance-type' title={intl.formatMessage({id: 'SETTINGS.INSURRANCE_TYPE'})} hasBullet={true} /> */}
        <SidebarMenuItem
          permission="reception_channel:read"
          to="/settings/receiving-channel"
          title={intl.formatMessage({ id: 'SETTINGS.RECEIVING_CHANNEL' })}
          hasBullet={true}
        />
        <SidebarMenuItem
          permission="response_channel:read"
          to="/settings/response-channel"
          title={intl.formatMessage({ id: 'SETTINGS.RESPONSE_CHANNEL' })}
          hasBullet={true}
        />
        {/* <SidebarMenuItem
          permission="status:read"
          to="/settings/status"
          title={intl.formatMessage({ id: 'SETTINGS.STATUS' })}
          hasBullet={true}
        /> */}
        <SidebarMenuItem
          permission="status:read"
          to="/settings/levels"
          title={intl.formatMessage({ id: 'SETTINGS.LEVEL' })}
          hasBullet={true}
        />
        <SidebarMenuItem
          permission="unity:read"
          to="/settings/unity"
          title={intl.formatMessage({ id: 'SETTINGS.UNITY' })}
          hasBullet={true}
        />
        <SidebarMenuItem
          permission="unity_type:read"
          to="/settings/unity-type"
          title={intl.formatMessage({ id: 'SETTINGS.UNITY_TYPE' })}
          hasBullet={true}
        />
        <SidebarMenuItem
          permission="admin"
          to="/settings/notification-server"
          title={intl.formatMessage({ id: 'SETTINGS.NOTIFS_SERVER' })}
          hasBullet={true}
        />
        <SidebarMenuItem
          permission="admin"
          to="/settings/agencies"
          title={intl.formatMessage({ id: 'SETTINGS.AGENCY' })}
          hasBullet={true}
        />
      </SidebarMenuItemWithSub>

      <SidebarMenuItemWithSub
        permission="admin"
        to="#"
        title="Utilisateurs"
        icon="logistic"
      >
        <SidebarMenuItem
          permission="admin"
          to="/users/list"
          title={intl.formatMessage({ id: 'SETTINGS.ACCOUNTS' })}
          hasBullet={true}
        />
        <SidebarMenuItem
          permission="role:read"
          to="/users/roles"
          title={intl.formatMessage({ id: 'SETTINGS.USERS_ROLES' })}
          hasBullet={true}
        />
      </SidebarMenuItemWithSub>

      {/* <SidebarMenuItemWithSub permission='admin' to='/logs/' title="Journaux" icon='logistic'>

      </SidebarMenuItemWithSub> */}

      <SidebarMenuItem
        permission="admin"
        to="/logs/users-logs"
        title="Journaux"
        icon="logistic"
      />

      <div className="separator  mb-2 mt-7"></div>

      <div className="menu-item fs-4 fw-bolder text-center">
        <a className="menu-link without-sub" href="/auth" onClick={() => logout()}>
          <i className="fa fa-sign-out mx-5" aria-hidden="true"></i>
          {intl.formatMessage({ id: 'AUTH.LOGOUT' })}
        </a>
      </div>

      {/* <SidebarMenuItem permission='admin' to='/builder' icon='switch' title='Layout Builder' fontIcon='bi-layers' /> */}

      {/* <div className='menu-item'>
        <div className='menu-content pt-8 pb-2'>
          <span className='menu-section text-muted text-uppercase fs-8 ls-1'>Gestion</span>
        </div>
      </div> */}

      {/* <SidebarMenuItemWithSub permission='admin' to='/logs/' title={intl.formatMessage({id: 'GEN.HOLDING_and_FILLIALE'})} icon='logistic'>

          <SidebarMenuItem permission='admin' to='/logs/logs' title={intl.formatMessage({id: 'GEN.HOLDING'})} hasBullet={true} />
          <SidebarMenuItem permission='admin' to='/logs/logs' title={intl.formatMessage({id: 'GEN.FILE'})} hasBullet={true} />

      </SidebarMenuItemWithSub> */}

      {/* <SidebarMenuItemWithSub permission='admin' to='/logs/' title={intl.formatMessage({id: 'GEN.ROLE_and_PROFILE'})} icon='logistic'>

          <SidebarMenuItem permission='admin' to='/logs/logs' title={intl.formatMessage({id: 'GEN.ROLE'})} hasBullet={true} />
          <SidebarMenuItem permission='admin' to='/logs/logs' title={intl.formatMessage({id: 'GEN.PROFILE'})} hasBullet={true} />

      </SidebarMenuItemWithSub> */}

      {/* <SidebarMenuItemWithSub permission='admin' to='/logs/' title={intl.formatMessage({id: 'GEN.LOGS'})} icon='logistic'>

          <SidebarMenuItem permission='admin' to='/logs/logs' title={intl.formatMessage({id: 'GEN.LOGS'})} hasBullet={true} />

      </SidebarMenuItemWithSub> */}

      {/* <div className='menu-item'>
        <div className='menu-content pt-8 pb-2'>
          <span className='menu-section text-muted text-uppercase fs-8 ls-1'>Crafted</span>
        </div>
      </div>

      <SidebarMenuItemWithSub
        to='/crafted/pages'
        title='Pages'
        fontIcon='bi-archive'
        icon='element-plus'
      >
        <SidebarMenuItemWithSub permission='admin' to='/crafted/pages/profile' title='Profile' hasBullet={true}>
          <SidebarMenuItem permission='admin' to='/crafted/pages/profile/overview' title='Overview' hasBullet={true} />
          <SidebarMenuItem permission='admin' to='/crafted/pages/profile/projects' title='Projects' hasBullet={true} />
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

        <SidebarMenuItemWithSub permission='admin' to='/crafted/pages/wizards' title='Wizards' hasBullet={true}>
          <SidebarMenuItem
            to='/crafted/pages/wizards/horizontal'
            title='Horizontal'
            hasBullet={true}
          />
          <SidebarMenuItem permission='admin' to='/crafted/pages/wizards/vertical' title='Vertical' hasBullet={true} />
        </SidebarMenuItemWithSub>
      </SidebarMenuItemWithSub>
      <SidebarMenuItemWithSub
        to='/crafted/accounts'
        title='Accounts'
        icon='profile-circle'
        fontIcon='bi-person'
      >
        <SidebarMenuItem permission='admin' to='/crafted/account/overview' title='Overview' hasBullet={true} />
        <SidebarMenuItem permission='admin' to='/crafted/account/settings' title='Settings' hasBullet={true} />
      </SidebarMenuItemWithSub>
      <SidebarMenuItemWithSub permission='admin' to='/error' title='Errors' fontIcon='bi-sticky' icon='cross-circle'>
        <SidebarMenuItem permission='admin' to='/error/404' title='Error 404' hasBullet={true} />
        <SidebarMenuItem permission='admin' to='/error/500' title='Error 500' hasBullet={true} />
      </SidebarMenuItemWithSub>
      <SidebarMenuItemWithSub
        to='/crafted/widgets'
        title='Widgets'
        icon='element-7'
        fontIcon='bi-layers'
      >
        <SidebarMenuItem permission='admin' to='/crafted/widgets/lists' title='Lists' hasBullet={true} />
        <SidebarMenuItem permission='admin' to='/crafted/widgets/statistics' title='Statistics' hasBullet={true} />
        <SidebarMenuItem permission='admin' to='/crafted/widgets/charts' title='Charts' hasBullet={true} />
        <SidebarMenuItem permission='admin' to='/crafted/widgets/mixed' title='Mixed' hasBullet={true} />
        <SidebarMenuItem permission='admin' to='/crafted/widgets/tables' title='Tables' hasBullet={true} />
        <SidebarMenuItem permission='admin' to='/crafted/widgets/feeds' title='Feeds' hasBullet={true} />
      </SidebarMenuItemWithSub>
      <div className='menu-item'>
        <div className='menu-content pt-8 pb-2'>
          <span className='menu-section text-muted text-uppercase fs-8 ls-1'>Apps</span>
        </div>
      </div>
      <SidebarMenuItemWithSub
        to='/apps/chat'
        title='Chat'
        fontIcon='bi-chat-left'
        icon='message-text-2'
      >
        <SidebarMenuItem permission='admin' to='/apps/chat/private-chat' title='Private Chat' hasBullet={true} />
        <SidebarMenuItem permission='admin' to='/apps/chat/group-chat' title='Group Chart' hasBullet={true} />
        <SidebarMenuItem permission='admin' to='/apps/chat/drawer-chat' title='Drawer Chart' hasBullet={true} />
      </SidebarMenuItemWithSub>
      <SidebarMenuItem
        to='/apps/user-management/users'
        icon='abstract-28'
        title='User management'
        fontIcon='bi-layers'
      />
      <div className='menu-item'>
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
  );
};

export { SidebarMenuMain };
