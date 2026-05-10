import { useCallback } from 'react';
import { openUrl } from '@tauri-apps/plugin-opener';
import toast from 'react-hot-toast';

const useExternalLink = () => {
  const openLink = useCallback((url: string) => {
    openUrl(url).catch((error: unknown) => {
      console.error('Failed to open external URL:', error);
      toast.error(`URLを開けませんでした: ${String(error)}`);
    });
  }, []);

  return openLink;
};

export default useExternalLink;
