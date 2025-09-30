import { createContext, useContext, useState } from 'react';
import axios, { AxiosError } from 'axios';
import type { Dispatch, ReactNode, SetStateAction } from 'react';
import type { RegisterUserType, User } from '@/types/user.type';

import {
  checkIdentifier as identifierChecker,
  login,
  register,
} from '@/lib/auth';

// interface Error {
//   type: string
//   error: string
//   ErrorCode: string
//   errorMessage: string
// }
type AuthContextType = {
  user: User | null;
  error?: string;
  loading: boolean;
  setError: Dispatch<SetStateAction<string | undefined>>;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  login: ({
    identifier,
    password,
  }: {
    identifier: string;
    password: string;
  }) => Promise<User>;
  checkIdentifier: (
    { identifier }: { identifier: string },
    loadingHandler?: () => void,
    loadingCleanUpHandler?: () => void,
  ) => Promise<{
    available: boolean;
    message?: string;
  }>;
  register: ({
    username,
    email,
    password,
    dateOfBirth,
    gender,
  }: RegisterUserType) => Promise<User>;
};

const authContext = createContext<AuthContextType>({
  user: null,
  error: undefined,
  loading: false,
  setIsLoading: () => {},
  setError: () => {},
  login: () => {
    throw new Error('AuthProvider not found');
  }, // ✅
  register: () => {
    throw new Error('AuthProvider not found');
  }, // ✅
  checkIdentifier: () => {
    throw new Error('AuthProvider not found');
  },
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>();

  const loginUser = async ({
    identifier,
    password,
  }: {
    identifier: string;
    password: string;
  }) => {
    setIsLoading(true);
    try {
      const { data } = await login({ identifier, password });
      console.log(data);
      setUser(data.user as User);

      return data.user;
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        // ✅ Correct ways to check status:

        // Option 1: Check response status
        // if (error.response?.status === 401) {
        //   setError('Invalid Credentials.')
        // }

        // Option 2: More comprehensive error handling
        if (err.response) {
          // Server responded with error status
          switch (err.response.status) {
            case 400:
              setError('Bad request - please check your input');
              break;
            case 401:
              setError('Invalid credentials');
              break;
            case 403:
              setError('Access forbidden');
              break;
            // Unprocessable Entity
            case 422:
              setError(err.response.data?.message || 'Validation error');
              break;
            case 500:
              setError('Server error - please try again later');
              break;
            default:
              setError(`Error: ${err.response.data?.message || err.message}`);
          }
        } else if (err.request) {
          // Network error
          setError('Network error - please check your connection');
        } else {
          // Other error
          setError(err.message);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const registerUser = async ({
    username,
    email,
    password,
    dateOfBirth,
    gender,
  }: RegisterUserType) => {
    try {
      const data = await register({
        username,
        email,
        password,
        dateOfBirth,
        gender,
      });
      console.log(data);
      return data;
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        // ✅ Correct ways to check status:

        // Option 1: Check response status
        // if (error.response?.status === 401) {
        //   setError('Invalid Credentials.')
        // }

        // Option 2: More comprehensive error handling
        if (err.response) {
          // Server responded with error status
          switch (err.response.status) {
            case 400:
              setError('Bad request - please check your input');
              break;
            case 403:
              setError('Access forbidden');
              break;
            case 409:
              setError('email or username already exists');
              break;
            // Unprocessable Entity
            case 422:
              setError(err.response.data?.message || 'Validation error');
              break;
            case 500:
              setError('Server error - please try again later');
              break;
            default:
              setError(`Error: ${err.response.data?.message || err.message}`);
          }
        } else if (err.request) {
          // Network error
          setError('Network error - please check your connection');
        } else {
          // Other error
          setError(err.message);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };
  const checkIdentifier = async (
    {
      identifier,
    }: {
      identifier: string;
    },
    loadingHandler?: () => void,
    loadingCleanUpHandler?: () => void,
  ) => {
    loadingHandler?.();
    try {
      const { data } = await identifierChecker({ identifier });

      return data;
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        console.log(err);
        // ✅ Correct ways to check status:

        // Option 1: Check response status
        // if (error.response?.status === 401) {
        //   setError('Invalid Credentials.')
        // }

        // Option 2: More comprehensive error handling
        if (err.response) {
          // Server responded with error status
          if (err.response.status === 409) {
            return {
              available: false,
              message: err.response.data?.message || 'Already taken',
            };
          }
        } else if (err.request) {
          // Network error
          setError('Network error - please check your connection');
        } else {
          // Other error
          setError(err.message);
        }
      }
    } finally {
      loadingCleanUpHandler?.();
    }
  };

  return (
    <authContext.Provider
      value={{
        loading: isLoading,
        login: loginUser,
        register: registerUser,
        user,
        error,
        setError,
        setIsLoading,
        checkIdentifier,
      }}
    >
      {children}
    </authContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(authContext);
  return context;
};
