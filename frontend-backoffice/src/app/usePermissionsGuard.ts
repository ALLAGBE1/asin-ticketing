import { applyPermissionGuards } from 'dom-elements-guards-react';
import { useEffect } from 'react';

const usePermissionGuards = () => {
  useEffect(() => {
    applyPermissionGuards();
  }, []);
};

export default usePermissionGuards;
