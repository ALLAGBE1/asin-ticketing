/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { FC, useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import { PageTitle } from '../../../../../_metronic/layout/core';
import { MenuComponent } from '../../../../../_metronic/assets/ts/components';
import { applyPermissionGuards } from 'dom-elements-guards-react';
import { LongClaimsTableFilter } from '../claimsTableFilter/longClaimsTableFilter';
import { LongClaimsTableFilterForUnFundedClaims } from '../claimsTableFilter/longClaimsTableFilterForUnFundedClaims';

const ClaimsNonFounded: FC = () => {
  const USER_DATAS_KEY = import.meta.env
    .VITE_SATIS_APP_AUTH_LOCAL_STORAGE_USER_DATAS;

  //@ts-ignore
  const user_datas = JSON.parse(localStorage.getItem(USER_DATAS_KEY));

  const intl = useIntl();

  useEffect(() => {
    applyPermissionGuards();

    MenuComponent.reinitialization();
  }, []);

  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: 'CLAIM.UNFOUNDED' })}
      </PageTitle>

      {/* claim table filter component */}
      <LongClaimsTableFilterForUnFundedClaims
        institution_id={user_datas.unity.institution.id}
        canMakeFilter={true}
        canExportClaim={false}
        canImportClaim={false}
        canAddClaim={true}
      />
    </>
  );
};

export { ClaimsNonFounded };
