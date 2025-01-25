/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */

const permission_key = import.meta.env
  .VITE_SATIS_APP_AUTH_LOCAL_STORAGE_USER_ROLE_PERMISSION;
//@ts-ignore
const USER_ROLE_PERMISSIONS_LIST: Array<any> = JSON.parse(
  //@ts-ignore
  localStorage.getItem(permission_key),
);

const USER_DATAS_KEY = import.meta.env
  .VITE_SATIS_APP_AUTH_LOCAL_STORAGE_USER_DATAS;

//@ts-ignore
const user_datas = JSON.parse(localStorage.getItem(USER_DATAS_KEY));

export function handleUserPermissionAccess(
  permission: string | Array<string> | any,
) {

  let index = 1;

  if (!USER_ROLE_PERMISSIONS_LIST) return false;
  else if (!permission) return false;
  else if (permission == 'PASS') return true;

  else if(permission.includes(';')) {

      const permissionToHandle_AND = permission.split(';');

      for(const __perm of permissionToHandle_AND) {

          if(USER_ROLE_PERMISSIONS_LIST.includes(__perm)) return true;
          else if(!USER_ROLE_PERMISSIONS_LIST.includes(__perm) && index <= permissionToHandle_AND.length) {
              index ++
              continue;
          }
          else if(!USER_ROLE_PERMISSIONS_LIST.includes(__perm) && index == permissionToHandle_AND.length) {
              return false;
          }
          else return false;

      }

  }
  else if (permission.includes('|')) {

      const permissionToHandle_OR = permission.split('|');

      for(const __perm of permissionToHandle_OR) {

          if(USER_ROLE_PERMISSIONS_LIST.includes(__perm)) return true;
          else if(!USER_ROLE_PERMISSIONS_LIST.includes(__perm) && index <= permissionToHandle_OR.length) {
              index ++
              continue;
          }
          else if(!USER_ROLE_PERMISSIONS_LIST.includes(__perm) && index == permissionToHandle_OR.length) {
              return false;
          }
          else return false;

      }

  }

  else {
    for (const perm of USER_ROLE_PERMISSIONS_LIST) {
      if (perm.scope == 'admin') return true;
      else if (perm.scope == permission) return true;

      if (
        perm.scope != permission &&
        index <= USER_ROLE_PERMISSIONS_LIST.length
      ) {
        index++;
        continue;
      } else return false;
    }
  }

}

export function IsAHolding() {
  return user_datas?.unity.institution.institution_type.libelle === 'HOLDING';
}
