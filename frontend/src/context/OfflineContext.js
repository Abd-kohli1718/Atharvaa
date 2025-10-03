import React, { createContext, useContext, useState, useEffect } from 'react';

const OfflineContext = createContext();

export const OfflineProvider = ({ children }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [offlineData, setOfflineData] = useState({});

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Load offline data from localStorage
    const loadOfflineData = () => {
      try {
        const savedData = localStorage.getItem('bhashaconnect_offline_data');
        if (savedData) {
          setOfflineData(JSON.parse(savedData));
        }
      } catch (error) {
        console.error('Error loading offline data:', error);
      }
    };

    loadOfflineData();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const saveOfflineData = (key, data) => {
    try {
      const newOfflineData = {
        ...offlineData,
        [key]: {
          data,
          timestamp: new Date().toISOString()
        }
      };
      setOfflineData(newOfflineData);
      localStorage.setItem('bhashaconnect_offline_data', JSON.stringify(newOfflineData));
    } catch (error) {
      console.error('Error saving offline data:', error);
    }
  };

  const getOfflineData = (key) => {
    return offlineData[key]?.data || null;
  };

  const clearOfflineData = () => {
    setOfflineData({});
    localStorage.removeItem('bhashaconnect_offline_data');
  };

  const value = {
    isOnline,
    offlineData,
    saveOfflineData,
    getOfflineData,
    clearOfflineData
  };

  return (
    <OfflineContext.Provider value={value}>
      {children}
    </OfflineContext.Provider>
  );
};

export const useOffline = () => {
  const context = useContext(OfflineContext);
  if (!context) {
    throw new Error('useOffline must be used within an OfflineProvider');
  }
  return context;
};
