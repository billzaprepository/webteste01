import React, { createContext, useContext, useState, useEffect } from 'react';
import { Settings, SettingsState } from '../types/settings';
import { Plan } from '../types/user';
import { storageService } from '../services/storage/StorageService';

const defaultPlans: Plan[] = [
  {
    id: 'basic',
    name: 'Básico',
    price: 49.90,
    description: 'Perfeito para começar',
    features: [
      'Até 5 webinars por mês',
      'Máximo de 100 espectadores',
      '10GB de armazenamento',
      'Chat ao vivo',
      'Relatórios básicos'
    ],
    maxWebinars: 5,
    maxViewers: 100,
    storageLimit: 10,
    customization: false,
    analytics: false
  }
];

const defaultMinioSettings = {
  endpoint: 'gaiawebinar-minio.ay09i1.easypanel.host',
  accessKey: 'OB2A4cEyCYMBcKIjThk3',
  secretKey: 'x78cFIha5G0IGfrEoyUX7WVyMv8GBPRUkbRnbI6I',
  bucket: 'webinar-videos',
  useSSL: true,
  port: 9000,
  region: 'us-east-1',
  consoleEndpoint: 'console-gaiawebinar-minio.ay09i1.easypanel.host',
  consolePort: 9001
};

const SettingsContext = createContext<SettingsState | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<Settings>(() => {
    const savedSettings = localStorage.getItem('settings');
    return savedSettings ? JSON.parse(savedSettings) : {
      logo: null,
      plans: defaultPlans,
      minioSettings: defaultMinioSettings
    };
  });

  useEffect(() => {
    const initStorage = async () => {
      try {
        await storageService.init(settings.minioSettings);
      } catch (error) {
        console.error('Failed to initialize storage:', error);
      }
    };

    initStorage();
  }, []);

  const updateSettings = async (newSettings: Partial<Settings>) => {
    try {
      const updatedSettings = {
        ...settings,
        ...newSettings
      };

      if (newSettings.minioSettings) {
        await storageService.updateConfig(newSettings.minioSettings);
      }

      setSettings(updatedSettings);
      localStorage.setItem('settings', JSON.stringify(updatedSettings));
    } catch (error) {
      console.error('Failed to update settings:', error);
      throw error;
    }
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};