import type { AdminLocation, AdminLocationEntry } from '../types/admin';
import { authorizedAxios } from './axios/index';

export const SendLocation = async (input: AdminLocationEntry): Promise<AdminLocation> => {
    const { data } = await authorizedAxios.post<AdminLocation>('admin/location/search', input);
    return data;
};
