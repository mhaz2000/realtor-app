import type { ApiResponse } from '../types/api';
import type { LoginRequest } from '../types/auth';
import { anonymousAxios } from './axios/index';

export const loginUser = async (credentials: LoginRequest): Promise<string> => {
  const { data } = await anonymousAxios.post<ApiResponse<string>>('Authentication/login', credentials);
  return data.data;
};