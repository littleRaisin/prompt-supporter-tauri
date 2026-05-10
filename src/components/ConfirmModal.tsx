import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { useTranslation } from 'react-i18next';
import Button from './Button';

type ConfirmModalProps = {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onClose: () => void;
};

const ConfirmModal = ({ isOpen, title, message, onConfirm, onClose }: ConfirmModalProps) => {
  const { t } = useTranslation();

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="bg-white rounded-lg shadow-xl max-w-sm w-full p-6">
          <DialogTitle className="text-lg font-bold mb-2">{title}</DialogTitle>
          <p className="text-gray-700 mb-6">{message}</p>
          <div className="flex justify-end gap-2">
            <Button text={t('common.cancelButton')} variant="secondary" onClick={onClose} />
            <Button text={t('common.deleteButton')} variant="danger" onClick={onConfirm} />
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default ConfirmModal;
