import React from 'react';
import { useAppStore } from '../store/appStore';
import { useTranslation } from '../hooks/useTranslation';
import { MOCK_PLATFORMS } from '../utils/constants';
import PlatformCard from '../components/PlatformCard';
import './Platforms.scss';

const Platforms = () => {
  const { t } = useTranslation();
  const setSelectedPlatform = useAppStore((state) => state.setSelectedPlatform);

  return (
    <div className="platforms">
      <h2 className="platforms__title">{t('selectPlatform')}</h2>
      <div className="platforms__grid">
        {MOCK_PLATFORMS.map(platform => (
          <PlatformCard
            key={platform.id}
            platform={platform}
            onClick={() => setSelectedPlatform(platform)}
          />
        ))}
      </div>
    </div>
  );
};

export default Platforms;


