import axios from 'axios';

const API_URL = import.meta.env.VITE_APP_SATTIS_BASE_URL;
const ASSETS_URL = `${API_URL}/api/v1/upload_file`;

export class FileUploadRequest {
  addFile(file: File, onDownloadProgressFunction: any) {
    const fileData = new FormData();
    fileData.append('upload', file);

    return axios.post(ASSETS_URL, fileData, {
      onUploadProgress: onDownloadProgressFunction,
    });
  }

  // updateFile(assetId:number, file: File) {

  //     const fileData = new FormData();
  //     fileData.append('upload', file);

  //     return axios.post(ASSETS_URL, fileData);
  // }
}
