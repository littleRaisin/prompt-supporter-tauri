import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const LANGUAGE_KEY = 'i18n_language';

const LanguageSwitcher = () => {
  const { i18n, t } = useTranslation();
  const [language, setLanguage] = useState(
    () => localStorage.getItem(LANGUAGE_KEY) ?? 'en'
  );

  useEffect(() => {
    localStorage.setItem(LANGUAGE_KEY, language);
    void i18n.changeLanguage(language);
  }, [language, i18n]);

  return (
    <select
      value={language}
      onChange={(e) => setLanguage(e.target.value)}
      className="text-black px-2 py-1 rounded border-gray-300 border"
      style={{ minWidth: 80 }}
    >
      <option value="en">{t('common.English')}</option>
      <option value="ja">{t('common.Japanese')}</option>
    </select>
  );
};

export default LanguageSwitcher;
