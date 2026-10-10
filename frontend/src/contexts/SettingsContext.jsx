import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    siteName: '6SwagDirT',
    siteDescription: 'فروشگاه آنلاین لباس',
    logo: '',
    phone: '',
    email: '',
    address: '',
    instagram: '',
    telegram: '',
    whatsapp: '',
    shippingCost: 50000,
    freeShippingThreshold: 1000000,
    primaryColor: '#0B51F4',
    secondaryColor: '#2ECC71',
    heroTitle: 'improve your swag',
    heroSubtitle: 'بهترین و کمیاب ترین لباس های استوک و وینتیج اورجینال',
    maintenanceMode: false,
    allowRegistration: true,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await api.get('/settings');
      if (res.data.success) {
        setSettings(res.data.data);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = (newSettings) => {
    setSettings(newSettings);
  };

  const value = {
    settings,
    loading,
    fetchSettings,
    updateSettings,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within SettingsProvider');
  }
  return context;
};