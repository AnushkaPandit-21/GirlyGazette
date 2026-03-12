import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SettingsContext = createContext();

const DEFAULT_SETTINGS = {
  enabledCategories: {
    finance: true,
    geopolitics: true,
    tech: true,
    gossip: true,
    dev: true,
  },
  language: 'English',
  geminiKey: '',
};

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    try {
      const saved = await AsyncStorage.getItem('app_settings');
      if (saved) {
        setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(saved) });
      }
    } catch (e) {}
    setLoaded(true);
  }

  async function updateSettings(newSettings) {
    const merged = { ...settings, ...newSettings };
    setSettings(merged);
    try {
      await AsyncStorage.setItem('app_settings', JSON.stringify(merged));
    } catch (e) {}
  }

  function toggleCategory(key) {
    const updated = {
      ...settings,
      enabledCategories: {
        ...settings.enabledCategories,
        [key]: !settings.enabledCategories[key],
      },
    };
    updateSettings(updated);
  }

  return (
    <SettingsContext.Provider
      value={{ settings, updateSettings, toggleCategory, loaded }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}
