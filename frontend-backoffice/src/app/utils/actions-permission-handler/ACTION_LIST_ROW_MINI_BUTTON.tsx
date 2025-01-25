/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
// import clsx from 'clsx'
import { handleUserPermissionAccess } from '../permissionAccessHandler';
import { KTIcon, WithChildren } from '../../../_metronic/helpers';

type Props = {
  modalComponentId?: string;
  title?: string;
  text?: string;
  icon?: string;
  permission?: string;
  styleClass?: string;
  onClickAction?: () => void;
};

const ACTION_LIST_ROW_MINI_BUTTON: React.FC<Props & WithChildren> = ({
  modalComponentId,
  title,
  text,
  icon,
  permission,
  styleClass,
  onClickAction,
}) => {
  return (
    <>
      {handleUserPermissionAccess(permission) && (
        <a
          onClick={onClickAction}
          title={title}
          className={'btn ' + styleClass}
          data-bs-toggle="modal"
          data-bs-target={modalComponentId}
        >
          {text}
          {icon && <KTIcon iconName={icon} className="fs-1" />}
        </a>
      )}
    </>
  );
};

export { ACTION_LIST_ROW_MINI_BUTTON };
