import React from 'react';
import { useTranslation } from 'react-i18next';
import { Wifi, WifiOff } from 'lucide-react';
import { useOffline } from '../context/OfflineContext';

const OfflineIndicator = () => {
  const { t } = useTranslation();
  const { isOnline } = useOffline();

  if (isOnline) return null;

  return (
    <div className="bg-yellow-500 text-white px-4 py-2 text-center text-sm font-medium">
      <div className="flex items-center justify-center space-x-2">
        <WifiOff className="w-4 h-4" />
        <span>{t('common.offline')}</span>
      </div>
    </div>
  );
};

export default OfflineIndicator;
