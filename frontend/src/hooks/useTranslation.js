import { useAppStore } from '../store/appStore';
import { translations } from '../utils/translations';

export const useTranslation = () => {
  const lang = useAppStore((state) => state.lang);

  const t = (key) => {
    return translations[lang]?.[key] || key;
  };

  return { t, lang };
};

