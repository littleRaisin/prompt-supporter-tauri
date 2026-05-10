import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getVersion } from '@tauri-apps/api/app';
import SidePanel from './SidePanel';
import LanguageSwitcher from './LanguageSwitcher';
import useExternalLink from '../hooks/useExternalLink';
import { GITHUB_REPOSITORY_URL } from '../utils/constants';

type SettingsPanelProps = {
  isOpen: boolean;
  onClose: () => void;
};

const SettingsPanel = ({ isOpen, onClose }: SettingsPanelProps) => {
  const { t } = useTranslation();
  const openExternalLink = useExternalLink();
  const [appVersion, setAppVersion] = useState('N/A');

  useEffect(() => {
    if (isOpen) {
      getVersion()
        .then((v) => setAppVersion(v))
        .catch((err) => console.error('Failed to get app version:', err));
    }
  }, [isOpen]);

  return (
    <SidePanel open={isOpen} onClose={onClose}>
      <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
        {t('common.Settings')}
      </h3>
      <ul className="mt-2">
        <li className="mb-4 flex gap-2 items-center">
          <p className="text-sm text-gray-500 w-24">{t('common.LanguageSetting')}</p>
          <LanguageSwitcher />
        </li>
        <li className="mb-4 flex gap-2 items-center">
          <p className="text-sm text-gray-500 w-24">{t('common.Version')}</p>
          <p>{appVersion}</p>
        </li>
        <li className="mb-4">
          <button
            type="button"
            className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
            onClick={() => openExternalLink(GITHUB_REPOSITORY_URL)}
          >
            {t('common.GitHubRepository')}
          </button>
        </li>
      </ul>
    </SidePanel>
  );
};

export default SettingsPanel;
