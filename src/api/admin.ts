import type { AdminLocation, AdminLocationEntry } from '../types/admin';
import { authorizedAxios } from './axios/index';

export const SendLocation = async (input: AdminLocationEntry): Promise<AdminLocation> => {
    const { data } = await authorizedAxios.post<AdminLocation>('admin/location/search', input);
    return data;
};

export const DownloadExcelTemplate = async (): Promise<Blob> => {
  const response = await authorizedAxios.get('/admin/template/download', {
    responseType: 'blob',
  });
  return response.data; // returns Blob representing the file content
};

export const UploadExcel = async (
    completion_date : string,
    address: string,
    file: File
): Promise<void> => {
    const formData = new FormData();
    formData.append('completion_date', completion_date );
    formData.append('address', address);
    formData.append('file', file); // 'file' is the key your backend expects

    await authorizedAxios.post(
        'admin/data/upload',
        formData,
        {
            headers: {
                'Content-Type': 'multipart/form-data', // important for file uploads
            },
        }
    );
};
