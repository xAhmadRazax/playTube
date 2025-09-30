import type { RegisterUserType } from '@/types/user.type';
import { axios } from '@/utils/axios.util';

export const register = async ({
  email,
  username,
  password,
  gender,
  dateOfBirth,
}: RegisterUserType) => {
  const { data } = await axios.post('/auth/register', {
    email,
    username,
    gender,
    dateOfBirth,
    password,
  });

  return data;
};

export const login = async ({
  identifier,
  password,
}: {
  identifier: string;
  password: string;
}) => {
  const { data } = await axios.post('/auth/login', { identifier, password });

  delete data.data.accessToken;
  delete data.data.refreshToken;
  return data;
};
export const checkIdentifier = async ({
  identifier,
}: {
  identifier: string;
}) => {
  const { data } = await axios.post('/auth/check-identifier', { identifier });

  return data;
};
