import type { LoginRequest, LoginResult } from '../types/auth';
import { anonymousAxios } from './axios/index';

export const loginUser = async (credentials: LoginRequest): Promise<string> => {
  const formData = toFormUrlEncoded(credentials);

  const { data } = await anonymousAxios.post<LoginResult>(
    'auth/login',
    formData,
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );

  return data.access_token;
};

export const loginAdmin = async (credentials: LoginRequest): Promise<string> => {
  const formData = toFormUrlEncoded(credentials);

  const { data } = await anonymousAxios.post<LoginResult>(
    'auth/admin/login',
    formData,
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );

  return data.access_token;
};

const toFormUrlEncoded = (data: Record<string, any>) =>
  new URLSearchParams(data).toString();