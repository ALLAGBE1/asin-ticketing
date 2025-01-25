/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { toAbsoluteUrl } from '../../_metronic/helpers';
import { logOut } from '../modules/auth/core/_requests';
import { StatusModel } from '../modules/gestion-paramettres/core/models/Status';
import { notificationErrorToast } from './notificationToasts';

const API_URL = import.meta.env.VITE_APP_SATTIS_BASE_URL;
//@ts-ignore
const USER_DATAS = JSON.parse(localStorage.getItem(import.meta.env.VITE_SATIS_APP_AUTH_LOCAL_STORAGE_USER_DATAS,),);

export function capitalizeStr(str: string | any): string {
  return str;
  // return str.toLocaleUpperCase();
}

export function UpperStr(str: string | any): string {
  return str;
  // return str.toUpperCase();
}

export function formatDateToNumeric(dateInput:Date | string) {
  // Convertir la date en objet Date si elle est sous forme de chaîne
  const date = new Date(dateInput);

  // Extraire le jour, le mois et l'année
  const day = date.getDate();
  const month = date.getMonth() + 1; // Les mois sont de 0 (janvier) à 11 (décembre), donc +1
  const year = date.getFullYear();

  // Formater la date sous la forme "Jour, Mois Année"
  return `${day}, ${month} ${year}`;
}

export function mergeArrays(array1: number[], array2: number[]): number[] {
  const mergedArray: number[] = new Array(array1.length + array2.length);
  let i = 0, j = 0, k = 0;

  while (i < array1.length && j < array2.length) {
      mergedArray[k++] = array1[i] <= array2[j] ? array1[i++] : array2[j++];
  }

  while (i < array1.length) {
      mergedArray[k++] = array1[i++];
  }

  while (j < array2.length) {
      mergedArray[k++] = array2[j++];
  }

  return mergedArray;
}


export function toISOString(date: Date | string): string {
  const _date = new Date(date);

  // Extraire les composantes de la date
  const year = _date.getFullYear();
  const month = ('0' + (_date.getMonth() + 1)).slice(-2); // Ajoute un zéro devant si nécessaire
  const day = ('0' + _date.getDate()).slice(-2); // Ajoute un zéro devant si nécessaire
  const hours = ('0' + _date.getHours()).slice(-2); // Ajoute un zéro devant si nécessaire
  const minutes = ('0' + _date.getMinutes()).slice(-2); // Ajoute un zéro devant si nécessaire
  const seconds = ('0' + _date.getSeconds()).slice(-2); // Ajoute un zéro devant si nécessaire
  const milliseconds = ('00' + _date.getMilliseconds()).slice(-3); // Ajoute des zéros devant si nécessaire

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}Z`;
}

export function _toISOString(date: Date | string): string {
  const _date = new Date(date);

  // Extraire les composantes de la date
  const year = _date.getFullYear();
  const month = ('0' + (_date.getMonth() + 1)).slice(-2); // Ajoute un zéro devant si nécessaire
  const day = ('0' + _date.getDate()).slice(-2); // Ajoute un zéro devant si nécessaire
  const hours = ('0' + _date.getHours()).slice(-2); // Ajoute un zéro devant si nécessaire
  const minutes = ('0' + _date.getMinutes()).slice(-2); // Ajoute un zéro devant si nécessaire
  const seconds = ('0' + _date.getSeconds()).slice(-2); // Ajoute un zéro devant si nécessaire
  const milliseconds = ('00' + _date.getMilliseconds()).slice(-3); // Ajoute des zéros devant si nécessaire

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

export function dateWithMinutes(date: Date | string): string {
  const _date = new Date(date);

  // Extraire les composantes de la date
  const year = _date.getFullYear();
  const month = ('0' + (_date.getMonth() + 1)).slice(-2); // Ajoute un zéro devant si nécessaire
  const day = ('0' + _date.getDate()).slice(-2); // Ajoute un zéro devant si nécessaire
  const hours = ('0' + _date.getHours()).slice(-2); // Ajoute un zéro devant si nécessaire
  const minutes = ('0' + _date.getMinutes()).slice(-2); // Ajoute un zéro devant si nécessaire
  const seconds = ('0' + _date.getSeconds()).slice(-2); // Ajoute un zéro devant si nécessaire
  const milliseconds = ('00' + _date.getMilliseconds()).slice(-3); // Ajoute des zéros devant si nécessaire

  return `${year}-${month}-${day}, ${hours}:${minutes}`;
}

export function closeModal(closer_id = 'modal_close') {
  document.getElementById(closer_id)?.click();
  //@ts-ignore
  document.getElementsByClassName('modal-backdrop')[0].remove('show');
}

export function getAvatarSrcLink(): string {
  return `https://api.dicebear.com/7.x/shapes/svg?seed=${USER_DATAS?.profile.last_name}+${USER_DATAS?.profile.first_name}`;
}

export function getAvatarSrcLinkForUser(
  firstname: string,
  lastname: string,
): string {
  return `https://api.dicebear.com/7.x/shapes/svg?seed=${lastname}+${firstname}`;
}

export function getGenderAvatar(str: string): string {
  return toAbsoluteUrl(
    `media/svg/avatars/${str === 'M' ? '015-boy-6' : '047-girl-25'}.svg`,
  );
}

export function getFileExtensionFromFileLink(str: string): string {
  return str.split('uploads/')[1].split('.')[1];
}

export function getFileExtensionFromFileType(str: string): string {
  return str.split('/')[1];
}

export function getFileTypeIcon(str: string): string {
  return toAbsoluteUrl(`media/file-types/${str}.png`);
}

export function getFileSource(uploadId: string): string {
  return `${API_URL}/api/v1/upload_file/${uploadId}`;
}

export function checkIfStatusIsVerified(
  mustStatus: string,
  toCheckStatus: StatusModel,
): boolean {
  return mustStatus == toCheckStatus.libelle;
}

export function handleHttpError(errorData: any) {

  if(!errorData.response.data.detail) notificationErrorToast(errorData.message);

  if (errorData.code == 'ERR_NETWORK')
    // notificationErrorToast(`ERREUR SERVEUR`);
  if (errorData.code == 'ERR_NETWORK_IO_SUSPENDED')
    notificationErrorToast(`Connexion Internet interrompu`);
  if (errorData.response.data)
    notificationErrorToast(errorData.response.data.detail);
  if (
    errorData.response.status == 401 &&
    errorData.response.data.detail == 'Could not validate credentials'
  ) {
    logOut();
  }
  if (
    errorData.response.status == 422
  ) {
    const _errorDatas = errorData.response.data.detail[0]
    console.log(`${_errorDatas.loc[_errorDatas.loc.length - 1]} - ${_errorDatas.msg}`)
    notificationErrorToast(
      `${_errorDatas.loc[_errorDatas.loc.length - 1]} - ${_errorDatas.msg}`
    );
  }
}
