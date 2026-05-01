import React, { createContext, useState, useContext, useEffect } from 'react';
import api from './api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await api.get('/auth/me');
          const settingsRes = await api.get('/auth/settings');
          const userData = { ...res.data, settings: settingsRes.data };
          setUser(userData);
          applySettings(settingsRes.data);
        } catch (err) {
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const applySettings = (settings) => {
    if (!settings) return;
    const root = document.documentElement;
    root.style.setProperty('--primary', settings.theme_color || '#7C3AED');
    
    if (settings.theme_mode === 'light') {
      root.style.setProperty('--bg-main', '#F8FAFC');
      root.style.setProperty('--bg-card', '#FFFFFF');
      root.style.setProperty('--text-main', '#0F172A');
      root.style.setProperty('--text-secondary', '#64748B');
      root.style.setProperty('--border', 'rgba(0, 0, 0, 0.1)');
      root.style.setProperty('--glass', 'rgba(255, 255, 255, 0.7)');
    } else {
      root.style.setProperty('--bg-main', '#0B1120');
      root.style.setProperty('--bg-card', '#111827');
      root.style.setProperty('--text-main', '#F8FAFC');
      root.style.setProperty('--text-secondary', '#94A3B8');
      root.style.setProperty('--border', 'rgba(255, 255, 255, 0.08)');
      root.style.setProperty('--glass', 'rgba(17, 24, 39, 0.7)');
    }
    
    if (settings.sidebar_compact) {
      root.style.setProperty('--sidebar-width', '80px');
    } else {
      root.style.setProperty('--sidebar-width', '280px');
    }
  };

  const updateSettings = async (newSettings) => {
    try {
      const res = await api.put('/auth/settings', newSettings);
      setUser(prev => ({ ...prev, settings: res.data }));
      applySettings(res.data);
    } catch (err) {
      console.error('Failed to update settings', err);
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const res = await api.put('/auth/profile', profileData);
      setUser(prev => ({ ...prev, ...res.data }));
      return { success: true };
    } catch (err) {
      console.error('Failed to update profile', err);
      return { success: false, error: err.response?.data?.error || 'Update failed' };
    }
  };

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', res.data.token);
    const userData = { ...res.data.user, settings: res.data.settings };
    setUser(userData);
    applySettings(res.data.settings);
    return userData;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    applySettings({ theme_mode: 'dark', theme_color: '#7C3AED' }); // Reset on logout
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, login, logout, isAdmin, loading, updateSettings, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
