import { create } from 'zustand';
import { AxiosError } from 'axios';

import type { RegisterUserType, User } from '@/types/user.type';
import {
  login as LoginService,
  checkIdentifier as checkIdentifierService,
  register as registerService,
} from '@/lib/auth';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string;
  login: ({
    identifier,
    password,
  }: {
    identifier: string;
    password: string;
  }) => Promise<void>;
  register: ({
    email,
    gender,
    dateOfBirth,
    password,
    username,
    confirmPassword,
  }: RegisterUserType) => Promise<void>;
  checkIdentifier: (
    identifier: string,
    loadingHandler?: () => void,
    loadingCleanUpHandler?: () => void,
  ) => Promise<{ available: boolean; message?: string }>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  error: '',
  login: async ({ identifier, password }) => {
    set({ isLoading: true });
    try {
      const { data } = await LoginService({ identifier, password });
      set({ user: data.user as User });
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        if (err.response) {
          // Server responded with error status
          switch (err.response.status) {
            case 400:
              set({ error: 'Bad request - please check your input' });
              break;
            case 401:
              set({ error: 'Invalid credentials' });
              break;
            case 403:
              set({ error: 'Access forbidden' });
              break;
            // Unprocessable Entity
            case 422:
              set({ error: err.response.data?.message || 'Validation error' });
              break;
            case 500:
              set({ error: 'Server error - please try again later' });
              break;
            default:
              set({
                error: `Error: ${err.response.data?.message || err.message}`,
              });
          }
        } else if (err.request) {
          // Network error
          set({ error: 'Network error - please check your connection' });
        } else {
          // Other error
          set({ error: err.message });
        }
      }
    } finally {
      set({ isLoading: false });
    }
  },
  checkIdentifier: async (
    identifier,
    loadingHandler,
    loadingCleanUpHandler,
  ) => {
    loadingHandler?.();
    try {
      const { data } = await checkIdentifierService({ identifier });

      return data;
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        if (err.response) {
          if (err.response.status === 409) {
            return {
              available: false,
              message: err.response.data?.message || 'Already taken',
            };
          }
        } else if (err.request) {
          // Network error
          set({ error: 'Network error - please check your connection' });
        } else {
          // Other error
          set({ error: err.message });
        }
      }
    } finally {
      loadingCleanUpHandler?.();
    }
  },
  register: async ({
    email,
    username,
    password,
    gender,
    dateOfBirth,
  }: RegisterUserType) => {
    set({ isLoading: true });
    try {
      const data = await registerService({
        username,
        email,
        password,
        dateOfBirth,
        gender,
      });
      return data;
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        if (err.response) {
          // Server responded with error status
          switch (err.response.status) {
            case 400:
              set({ error: 'Bad request - please check your input' });
              break;
            case 403:
              set({ error: 'Access forbidden' });
              break;
            case 409:
              set({ error: 'email or username already exists' });
              break;
            // Unprocessable Entity
            case 422:
              set({ error: err.response.data?.message || 'Validation error' });
              break;
            case 500:
              set({ error: 'Server error - please try again later' });
              break;
            default:
              set({
                error: `Error: ${err.response.data?.message || err.message}`,
              });
          }
        } else if (err.request) {
          // Network error
          set({ error: 'Network error - please check your connection' });
        } else {
          // Other error
          set({ error: err.message });
        }
      }
    } finally {
      set({ isLoading: false });
    }
  },
}));
