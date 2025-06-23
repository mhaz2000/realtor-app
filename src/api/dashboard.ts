import type { DashboardData } from '../types/dashboard';
import { authorizedAxios } from './axios/index';

export const getDashboardData = async (): Promise<DashboardData> => {
    const { data } = await authorizedAxios.get<DashboardData>('statistics/dashboard');
    return data;
};