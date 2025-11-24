import React from 'react';
import { Cpu, Zap, HardDrive, ChevronRight } from 'lucide-react';
import './PlatformCard.scss';

const iconMap = {
  'cpu': Cpu,
  'zap': Zap,
  'hard-drive': HardDrive,
  'layers': HardDrive
};

const PlatformCard = ({ platform, onClick }) => {
  const IconComponent = iconMap[platform.icon] || Cpu;

  return (
    <div 
      className={`platform-card platform-card--${platform.color}`}
      onClick={onClick}
    >
      <div className="platform-card__header">
        <div className={`platform-card__icon platform-card__icon--${platform.color}`}>
          <IconComponent size={24} />
        </div>
        <span className="platform-card__version">SDK v1.2.0</span>
      </div>
      
      <h3 className="platform-card__title">{platform.name}</h3>
      <p className="platform-card__code">{platform.code}</p>
      
      <div className="platform-card__action">
        Open Workspace <ChevronRight size={16} />
      </div>
    </div>
  );
};

export default PlatformCard;


