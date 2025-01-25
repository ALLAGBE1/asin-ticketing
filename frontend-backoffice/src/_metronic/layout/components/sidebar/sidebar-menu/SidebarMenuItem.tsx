import { FC } from 'react';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import clsx from 'clsx';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { checkIsActive, KTIcon, WithChildren } from '../../../../helpers';
import { useLayout } from '../../../core';
import { handleUserPermissionAccess } from '../../../../../app/utils/permissionAccessHandler';

type Props = {
  to: string;
  title: string;
  icon?: string;
  fontIcon?: string;
  permission?: string;
  hasBullet?: boolean;
};

const SidebarMenuItem: FC<Props & WithChildren> = ({
  children,
  to,
  title,
  icon,
  fontIcon,
  permission,
  hasBullet = false,
}) => {
  const { pathname } = useLocation();
  const isActive = checkIsActive(pathname, to);
  const { config } = useLayout();
  const { app } = config;

  return (
    <>
      {handleUserPermissionAccess(permission) ? (
        <div className="menu-item">
          <Link
            className={clsx('menu-link without-sub', { active: isActive })}
            to={to}
          >
            {hasBullet && (
              <span className="menu-bullet">
                <span className="bullet bullet-dot"></span>
              </span>
            )}
            {icon && app?.sidebar?.default?.menu?.iconType === 'svg' && (
              <span className="menu-icon">
                {' '}
                <KTIcon iconName={icon} className="fs-2" />
              </span>
            )}
            {fontIcon && app?.sidebar?.default?.menu?.iconType === 'font' && (
              <i className={clsx('bi fs-2', fontIcon)}></i>
            )}
            <span
              className="menu-title fs-5"
              // style={{fontSize: '14px'}}
            >
              {title}
            </span>
          </Link>
          {children}
        </div>
      ) : (
        ''
      )}
    </>
  );
};

export { SidebarMenuItem };
