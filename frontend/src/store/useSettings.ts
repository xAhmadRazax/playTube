import { create } from 'zustand';
import axios, { AxiosError } from 'axios';

export interface SettingsProps {
  siteLogo: string;
  siteLogoSVG: string;
}

interface Settings {
  settings: SettingsProps | null;
  isLoading: boolean;
  error: string;
  setSettings: (data: SettingsProps) => void;
}

export const useSettingStore = create<Settings>((set) => ({
  settings: null,
  isLoading: false,
  error: '',
  setSettings: (data: SettingsProps) => {
    set({ settings: { ...data } });
  },
}));
